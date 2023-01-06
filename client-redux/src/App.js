import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Fab, Alert, Snackbar } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

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

import { useDispatch, useSelector } from "react-redux";
import {
	setDrawerState,
	setBottomMenuState,
	setSnackbarOpen,
} from "./slices/uiSlice";

export default function App({ colorMode }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const addShareRoute = useMatch("/tweet/:id/share");

	// One bottom drawer is sharing across entire app
	// and needed to know which item it's engaging
	const [tweetIdOwner, setTweetIdOwner] = useState();

	const dispatch = useDispatch();

	const drawerState = useSelector(state => state.ui.drawerState);
	const bottomMenuState = useSelector(state => state.ui.bottomMenuState);
	const snackbarOpen = useSelector(state => state.ui.snackbarOpen);

	const auth = useSelector(state => state.auth.status);

	const tweets = useSelector(state => state.app.tweets);
	const isLoading = useSelector(state => {
		return state.app.status === "loading";
	});

	const toggleDrawer = open => event => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		dispatch(setDrawerState(open));
	};

	const toggleBottomMenu = (open, tweetIdOwner) => event => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setTweetIdOwner(tweetIdOwner);
		dispatch(setBottomMenuState(open));
	};

	return (
		<Box sx={{ ml: { md: "280px", sm: 0 } }}>
			{isLoading && <Loading />}

			<CssBaseline />
			<Box sx={{ pb: 7 }}>
				<Header toggleDrawer={toggleDrawer} />

				<MainNav
					theme={theme}
					colorMode={colorMode}
					drawerState={drawerState}
					toggleDrawer={toggleDrawer}
				/>

				<Routes>
					<Route
						path="/tweet/:id"
						element={
							<Tweet
								bottomMenuState={bottomMenuState}
								toggleBottomMenu={toggleBottomMenu}
							/>
						}
					/>

					<Route
						path="/tweet/add"
						element={auth ? <AddTweet /> : <Login />}
					/>

					<Route
						path="/@:handle"
						element={
							<Profile
								tweets={tweets}
								toggleBottomMenu={toggleBottomMenu}
							/>
						}
					/>

					<Route
						path="/tweet/:id/share"
						element={auth ? <AddShare /> : <Login />}
					/>

					<Route path="/tweet/:id/likes" element={<Likes />} />

					<Route path="/tweet/:id/shares" element={<Shares />} />

					<Route
						path="/user/:handle/followers"
						element={<Followers />}
					/>

					<Route
						path="/user/:handle/following"
						element={<Following />}
					/>

					<Route path="/notis" element={<Notis />} />

					<Route
						path="/"
						element={
							<Home
								tweets={tweets}
								toggleBottomMenu={toggleBottomMenu}
							/>
						}
					/>

					<Route path="/register" element={<Register />} />

					<Route path="/login" element={<Login />} />

					<Route path="/user/edit" element={<EditUser />} />

					<Route path="/error" element={<Error />} />
					<Route path="*" element={<NotFound />} />
				</Routes>

				{auth &&
					!addShareRoute &&
					location.pathname !== "/tweet/add" && (
						<Fab
							color="info"
							sx={{
								position: "fixed",
								bottom: "40px",
								right: "40px",
							}}
							onClick={() => {
								navigate("/tweet/add");
							}}>
							<AddIcon />
						</Fab>
					)}

				<BottomMenu
					tweetIdOwner={tweetIdOwner}
					bottomMenuState={bottomMenuState}
					toggleBottomMenu={toggleBottomMenu}
				/>
			</Box>

			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={snackbarOpen}
				autoHideDuration={5000}
				onClose={() => dispatch(setSnackbarOpen(false))}>
				<Alert severity="success">Your post has been added.</Alert>
			</Snackbar>
		</Box>
	);
}
