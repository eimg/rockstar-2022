import {
	useState,
	useEffect,
} from "react";

import { useTheme, } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import {
	Box,
	Fab,
	Alert,
	Snackbar,
} from "@mui/material";

import {
	Add as AddIcon,
} from "@mui/icons-material";

import {
	Route,
	Routes,
	useMatch,
	useNavigate,
	useLocation,
} from "react-router-dom";

import Home from "./Main/Home";
import Tweet from "./Main/Tweet";
import Likes from "./Pages/Likes";
import Notis from "./Pages/Notis";
import Login from "./Users/Login";
import Error from "./Utils/Error";
import Shares from "./Pages/Shares";
import Profile from "./Main/Profile";
import MainNav from "./Navs/MainNav";
import Loading from "./Utils/Loading";
import AddTweet from "./Forms/AddTweet";
import AddShare from "./Forms/AddShare";
import Register from "./Users/Register";
import NotFound from "./Utils/NotFound";
import EditUser from "./Users/EditUser";
import Header from "./Components/Header";
import Followers from "./Pages/Followers";
import Following from "./Pages/Following";
import BottomMenu from "./Navs/BottomMenu";

import {
	putLike,
	getToken,
	fetchUser,
	fetchTweet,
	fetchTweets,
	postNoti,
} from "./apiCalls";

export default function App({ colorMode }) {

	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const addShareRoute = useMatch("/tweet/:id/share");

	let [auth, setAuth] = useState(false);
	let [tweet, setTweet] = useState({});
	let [tweets, setTweets] = useState([]);
	let [authUser, setAuthUser] = useState({});
	let [notiCount, setNotiCount] = useState(0);
	let [isLoading, setIsLoading] = useState(true);
	let [tweetIdOwner, setTweetIdOwner] = useState();

	let [drawerState, setDrawerState] = useState(false);
	let [snackbarOpen, setSnackbarOpen] = useState(false);
	let [bottomMenuState, setBottomMenuState] = useState(false);

	useEffect(() => {
		if (getToken()) setAuth(true);
	}, []);

	useEffect(() => {
		(async () => {
			let result = await fetchTweets();
			if (!result) return navigate("/error");

			setTweets(result);
			setIsLoading(false);
		})();
	}, [tweetIdOwner, navigate]);

	useEffect(() => {
		(async () => {
			let user = await fetchUser();
			if (!user) return false;

			setAuthUser(user);
		})();
	}, [auth]);

	const toggleDrawer = open => event => {
		if (event.type === "keydown"
			&& (event.key === "Tab"
				|| event.key === "Shift")
		) {
			return;
		}

		setDrawerState(open);
	};

	const toggleBottomMenu = (open, tweetIdOwner) => event => {
		if (event.type === "keydown"
			&& (event.key === "Tab"
				|| event.key === "Shift")
		) {
			return;
		}

		setTweetIdOwner(tweetIdOwner);
		setBottomMenuState(open);
	};

	const addComment = reply => {
		tweet.comments.push(reply);
		setTweet({ ...tweet });
		setTweets(tweets.map(t => {
			if (t._id === reply.origin) {
				t.comments.push(reply);
			}

			return t;
		}));
	}

	const toggleLike = id => {
		if (!auth) return false;

		(async () => {
			let likes = await putLike(id);
			if (!likes) return navigate("/error");

			let updatedTweets = await Promise.all(
				tweets.map(async (tweet) => {
					if (tweet._id === id) {
						tweet.likes = likes;

						let updatedTweet = await fetchTweet(id);
						if (!updatedTweet) return navigate("/error");

						setTweet(updatedTweet);
					}

					return tweet;
				})
			);

			setTweets(updatedTweets);
			postNoti("like", id);
		})();
	}

	const toggleLikeForComment = (commentId, tweetId) => {
		if (!auth) return false;

		(async () => {
			let likes = await putLike(commentId);
			if (!likes) return navigate("/error");

			let result = await fetchTweet(tweetId);
			if (!result) return navigate("/error");

			setTweet(result);
		})();
	}

	return (
		<Box sx={{ ml: { md: "280px", sm: 0 } }}>

			{isLoading && <Loading />}

			<CssBaseline />
			<Box sx={{ pb: 7 }}>
				<Header
					auth={auth}
					notiCount={notiCount}
					setNotiCount={setNotiCount}
					toggleDrawer={toggleDrawer}
				/>

				<MainNav
					auth={auth}
					theme={theme}
					setAuth={setAuth}
					authUser={authUser}
					colorMode={colorMode}
					drawerState={drawerState}
					setAuthUser={setAuthUser}
					toggleDrawer={toggleDrawer}
				/>

				<Routes>

					<Route
						path="/tweet/:id"
						element={
							<Tweet
								auth={auth}
								tweet={tweet}
								setTweet={setTweet}
								authUser={authUser}
								addComment={addComment}
								toggleLike={toggleLike}
								bottomMenuState={bottomMenuState}
								toggleBottomMenu={toggleBottomMenu}
								toggleLikeForComment={toggleLikeForComment}
							/>
						}
					/>

					<Route
						path="/tweet/add"
						element={
							auth
								? <AddTweet
									setSnackbarOpen={setSnackbarOpen}
								/>
								: <Login />
						}
					/>

					<Route
						path="/@:handle"
						element={
							<Profile
								auth={auth}
								tweets={tweets}
								authUser={authUser}
								toggleLike={toggleLike}
								setAuthUser={setAuthUser}
								toggleBottomMenu={toggleBottomMenu}
							/>
						}
					/>

					<Route
						path="/tweet/:id/share"
						element={
							auth
								? <AddShare
									setSnackbarOpen={setSnackbarOpen}
								/>
								: <Login />
						}
					/>

					<Route
						path="/tweet/:id/likes"
						element={
							<Likes
								authUser={authUser}
								setAuthUser={setAuthUser}
							/>
						}
					/>

					<Route
						path="/tweet/:id/shares"
						element={
							<Shares
								authUser={authUser}
								setAuthUser={setAuthUser}
							/>
						}
					/>

					<Route
						path="/user/:handle/followers"
						element={
							<Followers
								authUser={authUser}
								setAuthUser={setAuthUser}
							/>
						}
					/>

					<Route
						path="/user/:handle/following"
						element={
							<Following
								authUser={authUser}
								setAuthUser={setAuthUser}
							/>
						}
					/>

					<Route
						path="/notis"
						element={
							<Notis setNotiCount={setNotiCount} />
						}
					/>

					<Route
						path="/"
						element={
							<Home
								auth={auth}
								tweets={tweets}
								authUser={authUser}
								toggleLike={toggleLike}
								toggleBottomMenu={toggleBottomMenu}
							/>
						}
					/>

					<Route path="/register" element={
						<Register
							setAuth={setAuth}
							setAuthUser={setAuthUser}
						/>
					}
					/>

					<Route path="/login" element={
						<Login
							setAuth={setAuth}
							setAuthUser={setAuthUser}
						/>
					}
					/>

					<Route path="/user/edit" element={
						<EditUser
							authUser={authUser}
							setAuthUser={setAuthUser}
						/>
					}
					/>

					<Route path="/error" element={<Error />} />
					<Route path="*" element={<NotFound />} />
				</Routes>

				{
					(
						auth
						&& !addShareRoute
						&& location.pathname !== "/tweet/add"
					) &&

					<Fab
						color="info"
						sx={{
							position: "fixed",
							bottom: "40px",
							right: "40px"
						}}
						onClick={() => {
							navigate("/tweet/add");
						}}
					>
						<AddIcon />
					</Fab>
				}

				<BottomMenu
					auth={auth}
					authUser={authUser}
					tweetIdOwner={tweetIdOwner}
					bottomMenuState={bottomMenuState}
					toggleBottomMenu={toggleBottomMenu}
				/>
			</Box>

			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				open={snackbarOpen}
				autoHideDuration={5000}
				onClose={() => setSnackbarOpen(false)}
			>
				<Alert severity="success">
					Your post has been added.
				</Alert>
			</Snackbar>

		</Box>
	);
}
