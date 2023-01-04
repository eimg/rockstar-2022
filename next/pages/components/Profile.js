import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "./AuthProvider";
import { Tab, Tabs, Box, Avatar, Typography, Button } from "@mui/material";
import { pink, lightBlue } from "@mui/material/colors";

import {
	putLike,
	putFollow,
	fetchTweetsByHandle,
	fetchUserByHandle,
	fetchCommentsByHandle,
	fetchLikedTweetsByHandle,
} from "../../utils/apiCalls";

import TweetList from "./TweetList";

export default function Profile() {
	const router = useRouter();
	const { authStatus, authUser, setAuthStatus, setAuthUser } =
		useContext(AuthContext);
	const [tab, setTab] = useState(0);
	const [user, setUser] = useState({});
	const [tweets, setTweets] = useState([]);
	const [comments, setComments] = useState([]);
	const [likedTweets, setLikedTweets] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	let { handle } = router.query;

	useEffect(() => {
		setIsLoading(true);

		(async () => {
			let result = await fetchUserByHandle(handle);
			// if (!result) return navigate("/error");

			if (result) setUser(result);

			let tweets = await fetchTweetsByHandle(handle);
			// if (!tweets) return navigate("/error");

			if (tweets) setTweets(tweets);

			let comments = await fetchCommentsByHandle(handle);
			// if (!comments) return navigate("/error");

			if (comments) setComments(comments);

			let likes = await fetchLikedTweetsByHandle(handle);
			// if (!likes) return navigate("/error");

			if (likes) setLikedTweets(likes);

			setIsLoading(false);
		})();
	}, [handle, authUser]);

	const toggleLikeOnPosts = id => {
		if (!authStatus) return false;

		(async () => {
			let likes = await putLike(id);
			if (!likes) return;

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
		if (!authStatus) return false;

		(async () => {
			let likes = await putLike(id);
			if (!likes) return;

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
		if (!authStatus) return false;

		(async () => {
			let likes = await putLike(id);
			if (!likes) return;

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

	const removeTweet = id => {
		setTweets(tweets.filter(tweet => tweet._id === id));
	};

	const removeComment = id => {
		setComments(comments.filter(tweet => tweet._id === id));
	};

	const removeLikedTweet = id => {
		setLikedTweets(likedTweets.filter(tweet => tweet._id === id));
	};

	return (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			{isLoading ? (
				<></>
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
												href={`/following/${authUser.handle}`}
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
												href={`/followers/${authUser.handle}`}
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
												href={`/following/${user.handle}`}
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
												href={`/followers/${user.handle}`}
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
							{authStatus ? (
								handle === authUser.handle ? (
									<Button
										size="small"
										color="info"
										variant="outlined"
										sx={{ borderRadius: 5 }}
										onClick={() => {
											router.push("/edit");
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
												if (!result) return;

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
												if (!result) return;

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
						<TweetList
							tweets={tweets}
							toggleLike={toggleLikeOnPosts}
							remove={removeTweet}
						/>
					</Box>
					<Box hidden={tab !== 1} sx={{ py: 4 }}>
						<TweetList
							tweets={comments}
							toggleLike={toggleLikeOnComments}
							remove={removeComment}
						/>
					</Box>
					<Box hidden={tab !== 2} sx={{ py: 4 }}>
						<TweetList
							tweets={likedTweets}
							toggleLike={toggleLikeOnLikedTweets}
							remove={removeLikedTweet}
						/>
					</Box>
				</Box>
			)}
		</Box>
	);
}
