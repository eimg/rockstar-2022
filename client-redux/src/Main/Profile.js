import { useEffect, useState } from "react";

import { Tab, Tabs, Box, Avatar, Typography, Button } from "@mui/material";

import { pink, lightBlue } from "@mui/material/colors";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loading from "../Utils/Loading";

import {
	putLike,
	putFollow,
	fetchTweetsByHandle,
	fetchUserByHandle,
	fetchCommentsByHandle,
	fetchLikedTweetsByHandle,
} from "../apiCalls";

import MainList from "./MainList";

import { useSelector, useDispatch } from "react-redux";

export default function Profile({
	toggleBottomMenu,
}) {
	const navigate = useNavigate();
	const [tab, setTab] = useState(0);
	const [user, setUser] = useState({});
	const [tweets, setTweets] = useState([]);
	const [comments, setComments] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [likedTweets, setLikedTweets] = useState([]);

	let { handle } = useParams();

	const dispatch = useDispatch();
	const auth = useSelector(state => state.auth.status);
	const authUser = useSelector(state => state.auth.user);

	const setAuthUser = user => {
		dispatch(setUser(user));
	}

	useEffect(() => {
		setIsLoading(true);

		(async () => {
			let result = await fetchUserByHandle(handle);
			if (!result) return navigate("/error");

			setUser(result);

			let tweets = await fetchTweetsByHandle(handle);
			if (!tweets) return navigate("/error");

			setTweets(tweets);

			let comments = await fetchCommentsByHandle(handle);
			if (!comments) return navigate("/error");

			setComments(comments);

			let likes = await fetchLikedTweetsByHandle(handle);
			if (!likes) return navigate("/error");

			setLikedTweets(likes);

			return setIsLoading(false);
		})();
	}, [handle, authUser, navigate]);

	const toggleLikeOnPosts = id => {
		if (!auth) return false;

		(async () => {
			let likes = await putLike(id);
			if (!likes) return navigate("/error");

			let updatedTweets = await Promise.all(
				tweets.map(async tweet => {
					if (tweet._id === id) {
						tweet.likes = likes;
					}

					return tweet;
				}),
			);

			setTweets(updatedTweets);
		})();
	};

	const toggleLikeOnComments = id => {
		if (!auth) return false;

		(async () => {
			let likes = await putLike(id);
			if (!likes) return navigate("/error");

			let updatedComments = await Promise.all(
				comments.map(async comment => {
					if (comment._id === id) {
						comment.likes = likes;
					}

					return comment;
				}),
			);

			setComments(updatedComments);
		})();
	};

	const toggleLikeOnLikedTweets = id => {
		if (!auth) return false;

		(async () => {
			let likes = await putLike(id);
			if (!likes) return navigate("/error");

			let updatedTweets = await Promise.all(
				likedTweets.map(async tweet => {
					if (tweet._id === id) {
						tweet.likes = likes;
					}

					return tweet;
				}),
			);

			setLikedTweets(updatedTweets);
		})();
	};

	const tabChange = (event, switchTab) => {
		setTab(switchTab);
	};

	return (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			{isLoading ? (
				<Loading />
			) : (
				<Box>
					<Box
						sx={{
							height: "140px",
							bgcolor: lightBlue[500],
							borderRadius: 1,
						}}></Box>

					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
						}}>
						<Box sx={{ ml: "20px", mt: "-50px", mb: 3 }}>
							<Avatar
								alt="Profile"
								sx={{
									mb: 1,
									width: 96,
									height: 96,
									bgcolor: pink[500],
								}}
							/>

							<Box sx={{ ml: 1 }}>
								<Typography
									sx={{ fontSize: "1.2em", mb: "-5px" }}>
									<b>{user && user.name}</b>
								</Typography>

								<Typography
									variant="body2"
									sx={{ mb: 1, color: "text.fade" }}>
									@{user && user.handle}
								</Typography>

								<Typography sx={{ fontSize: "0.8em" }}>
									{user && user.profile}
								</Typography>

								{handle === authUser.handle ? (
									<>
										<Typography
											component="span"
											sx={{
												mr: 3,
												fontSize: 14,
												color: "text.fade",
											}}>
											<Link
												to={`/user/${authUser.handle}/following`}
												style={{
													color: pink[400],
													textDecoration: "none",
												}}>
												{(authUser.following &&
													authUser.following
														.length) ||
													0}{" "}
												Following
											</Link>
										</Typography>

										<Typography
											component="span"
											sx={{
												fontSize: 14,
												color: "text.fade",
											}}>
											<Link
												to={`/user/${authUser.handle}/followers`}
												style={{
													color: pink[400],
													textDecoration: "none",
												}}>
												{(authUser.followers &&
													authUser.followers
														.length) ||
													0}{" "}
												Followers
											</Link>
										</Typography>
									</>
								) : (
									<>
										<Typography
											component="span"
											sx={{
												mr: 3,
												fontSize: 14,
												color: "text.fade",
											}}>
											<Link
												to={`/user/${user.handle}/following`}
												style={{
													color: pink[400],
													textDecoration: "none",
												}}>
												{(user.following &&
													user.following.length) ||
													0}{" "}
												Following
											</Link>
										</Typography>

										<Typography
											component="span"
											sx={{
												fontSize: 14,
												color: "text.fade",
											}}>
											<Link
												to={`/user/${user.handle}/followers`}
												style={{
													color: pink[400],
													textDecoration: "none",
												}}>
												{(user.followers &&
													user.followers.length) ||
													0}{" "}
												Followers
											</Link>
										</Typography>
									</>
								)}
							</Box>
						</Box>
						<Box sx={{ pt: 2 }}>
							{auth ? (
								handle === authUser.handle ? (
									<Button
										size="small"
										color="info"
										variant="outlined"
										sx={{ borderRadius: 5 }}
										onClick={() => {
											navigate("/user/edit");
										}}>
										Edit Profile
									</Button>
								) : user.followers &&
								  user.followers.includes(authUser._id) ? (
									<Button
										size="small"
										color="info"
										variant="outlined"
										sx={{ borderRadius: 5 }}
										onClick={() => {
											(async () => {
												let result = await putFollow(
													user._id,
												);
												if (!result) navigate("/error");

												user.followers =
													result.followers;
												authUser.following =
													result.following;

												setUser({ ...user });
												setAuthUser({ ...authUser });
											})();
										}}>
										Followed
									</Button>
								) : (
									<Button
										size="small"
										color="info"
										variant="contained"
										sx={{ borderRadius: 5 }}
										onClick={() => {
											(async () => {
												let result = await putFollow(
													user._id,
												);
												if (!result) navigate("/error");

												user.followers =
													result.followers;
												authUser.following =
													result.following;

												setUser({ ...user });
												setAuthUser({ ...authUser });
											})();
										}}>
										Follow
									</Button>
								)
							) : (
								<></>
							)}
						</Box>
					</Box>

					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<Tabs
							value={tab}
							onChange={tabChange}
							variant="fullWidth"
							TabIndicatorProps={{
								style: { background: lightBlue[500] },
							}}>
							<Tab label="Posts" />
							<Tab label="Comments" />
							<Tab label="Likes" />
						</Tabs>
					</Box>
					<Box hidden={tab !== 0} sx={{ py: 4 }}>
						<MainList
							auth={auth}
							tweets={tweets}
							authUser={authUser}
							toggleLike={toggleLikeOnPosts}
							toggleBottomMenu={toggleBottomMenu}
						/>
					</Box>
					<Box hidden={tab !== 1} sx={{ py: 4 }}>
						<MainList
							auth={auth}
							tweets={comments}
							authUser={authUser}
							toggleLike={toggleLikeOnComments}
							toggleBottomMenu={toggleBottomMenu}
						/>
					</Box>
					<Box hidden={tab !== 2} sx={{ py: 4 }}>
						<MainList
							auth={auth}
							tweets={likedTweets}
							authUser={authUser}
							toggleLike={toggleLikeOnLikedTweets}
							toggleBottomMenu={toggleBottomMenu}
						/>
					</Box>
				</Box>
			)}
		</Box>
	);
}
