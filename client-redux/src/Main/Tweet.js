import { useEffect, useRef } from "react";

import {
	Box,
	Card,
	Input,
	Avatar,
	Button,
	Typography,
	IconButton,
	CardContent,
	FormControl,
	ButtonGroup,
	CardActionArea,
	InputAdornment,
} from "@mui/material";

import {
	Send as SendIcon,
	Share as ShareIcon,
	MoreVert as MoreVertIcon,
	Favorite as FavoriteIcon,
	ChatBubble as ChatBubbleIcon,
	FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";

import { green } from "@mui/material/colors";

import { useNavigate, useParams } from "react-router-dom";
import { formatRelative, parseISO } from "date-fns";
import { postNoti, postReply } from "../apiCalls";
import { useSelector, useDispatch } from "react-redux";
import { addComment, toggleLike, fetchSingle } from "../slices/appSlice";

export default function Tweet({ toggleBottomMenu }) {
	const navigate = useNavigate();
	const { id } = useParams();

	const input = useRef();

	const dispatch = useDispatch();

	const auth = useSelector(state => state.auth.status);
	const authUser = useSelector(state => state.auth.user);
	const tweet =
		useSelector(state =>
			state.app.tweets.filter(tweet => tweet._id === id),
		)[0] || {};

	useEffect(() => {
		// initial fetch only took a few latest posts
		// some attachment posts are older than that
		// require a new fetch to make sure it exists
		// in the state
		dispatch(fetchSingle(id));
	}, [id, dispatch]);

	return (
		tweet.user && (
			<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
				<Card variant="outlined" key={id} sx={{ mb: 3 }}>
					<CardContent sx={{ display: "flex", px: 2, pt: 2, pb: 0 }}>
						<Box sx={{ flex: 1 }}>
							{tweet.type === "share" && (
								<Box
									sx={{
										mb: 2,
										ml: 1,
										display: "flex",
										fontSize: "16px",
										color: "text.fade",
									}}>
									<ShareIcon
										sx={{ fontSize: "18px", p: 0, mr: 2 }}
									/>
									<div style={{ marginTop: -2 }}>share</div>
								</Box>
							)}

							{tweet.type === "comment" && (
								<Box
									sx={{
										mb: 2,
										ml: 1,
										display: "flex",
										fontSize: "16px",
										color: "text.fade",
									}}>
									<ChatBubbleIcon
										sx={{ fontSize: "18px", p: 0, mr: 2 }}
									/>
									<div style={{ marginTop: -2 }}>comment</div>
								</Box>
							)}

							<Box sx={{ display: "flex" }}>
								<Box sx={{ mr: 3, display: "flex" }}>
									<div
										onClick={e => {
											navigate(
												"/@" + tweet.user[0].handle,
											);
											e.stopPropagation();
										}}>
										<Avatar
											alt="Profile Picture"
											sx={{
												width: 64,
												height: 64,
												bgcolor: green[500],
											}}
										/>
									</div>
								</Box>

								<Box>
									<Typography variant="h6">
										{tweet.user[0].name}
									</Typography>

									<Typography
										variant="subtitle1"
										sx={{ color: "text.fade" }}>
										@{tweet.user[0].handle}
									</Typography>
								</Box>
							</Box>
						</Box>

						<Box>
							<IconButton
								edge="end"
								onClick={toggleBottomMenu(true, {
									_id: tweet._id,
									owner: tweet.owner,
								})}>
								<MoreVertIcon color="text.fade" />
							</IconButton>
						</Box>
					</CardContent>

					<CardContent>
						<Typography variant="subtitle1" sx={{ mb: 2 }}>
							{tweet.body}
						</Typography>

						<Typography variant="body2" sx={{ color: "text.fade" }}>
							{formatRelative(
								parseISO(tweet.created),
								new Date(),
							)}
						</Typography>
					</CardContent>

					{tweet.origin_tweet[0] && (
						<Card
							sx={{
								p: 2,
								mx: 3,
								my: 2,
								bgcolor: "banner.background",
							}}
							elevation={0}>
							<CardActionArea
								onClick={() => {
									navigate(
										"/tweet/" + tweet.origin_tweet[0]._id,
									);
								}}>
								<CardContent sx={{ display: "flex", p: 2 }}>
									<Box sx={{ mr: 3 }}>
										<div
											onClick={e => {
												navigate(
													"/@" +
														tweet.origin_tweet[0]
															.user[0].handle,
												);
												e.stopPropagation();
											}}>
											<Avatar
												alt="Profile Picture"
												sx={{ width: 48, height: 48 }}
											/>
										</div>
									</Box>

									<Box>
										<Typography
											sx={{ mr: 1 }}
											component="span"
											color="text.secondary">
											<b>
												{
													tweet.origin_tweet[0]
														.user[0].name
												}
											</b>
										</Typography>

										<Typography
											component="span"
											sx={{ color: "text.fade", mr: 1 }}>
											@
											{
												tweet.origin_tweet[0].user[0]
													.handle
											}
										</Typography>

										<Typography
											variant="body2"
											component="span"
											sx={{ color: "text.fade" }}>
											{formatRelative(
												parseISO(
													tweet.origin_tweet[0]
														.created,
												),
												new Date(),
											)}
										</Typography>

										<Typography
											color="text.fade"
											variant="subtitle1"
											sx={{ fontSize: "16px" }}>
											{tweet.origin_tweet[0].body}
										</Typography>
									</Box>
								</CardContent>
							</CardActionArea>
						</Card>
					)}

					{tweet.origin && !tweet.origin_tweet[0] && (
						<Card
							sx={{
								p: 2,
								mx: 3,
								my: 2,
								bgcolor: "banner.background",
							}}
							elevation={0}>
							<CardContent>
								<Typography
									sx={{
										color: "text.fade",
										fontSize: "16px",
									}}>
									[ deleted post ]
								</Typography>
							</CardContent>
						</Card>
					)}

					<Box
						// tweet"s actions
						sx={{
							mb: 2,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-around",
						}}>
						<ButtonGroup variant="text">
							<IconButton
								size="small"
								disableRipple={true}
								onClick={() => {
									if (auth)
										dispatch(
											toggleLike({
												target: tweet._id,
												actor: authUser._id,
											}),
										);
								}}>
								{tweet.likes &&
								tweet.likes.includes(authUser._id) ? (
									<FavoriteIcon color="error" />
								) : (
									<FavoriteBorderIcon color="error" />
								)}
							</IconButton>
							<Button
								onClick={() => {
									if (tweet.likes && tweet.likes.length)
										navigate(`/tweet/${tweet._id}/likes`);
								}}
								sx={{
									color: "text.fade",
									"&:hover": {
										backgroundColor: "transparent",
									},
								}}>
								{(tweet.likes && tweet.likes.length) || 0}
							</Button>
						</ButtonGroup>

						<ButtonGroup variant="text">
							<IconButton
								onClick={() => {
									if (auth)
										navigate(`/tweet/${tweet._id}/share`);
								}}
								size="small"
								disableRipple={true}>
								<ShareIcon color="primary" />
							</IconButton>
							<Button
								onClick={() => {
									if (tweet.shares && tweet.shares.length)
										navigate(`/tweet/${tweet._id}/shares`);
								}}
								sx={{
									color: "text.fade",
									"&:hover": {
										backgroundColor: "transparent",
									},
								}}>
								{(tweet.shares && tweet.shares.length) || 0}
							</Button>
						</ButtonGroup>

						<ButtonGroup variant="text">
							<IconButton
								size="small"
								href="#comments"
								disableRipple={true}>
								<ChatBubbleIcon color="success" />
							</IconButton>

							<Button
								href="#comments"
								sx={{
									color: "text.fade",
									"&:hover": {
										backgroundColor: "transparent",
									},
								}}>
								{(tweet.comments && tweet.comments.length) || 0}
							</Button>
						</ButtonGroup>
					</Box>
				</Card>

				<div id="comments">
					{tweet.comments && tweet.comments.map(comment => (
						<Card
							variant="outlined"
							key={comment._id}
							sx={{ mb: 0 }}>
							<CardActionArea
								onClick={() => {
									navigate("/tweet/" + comment._id);
								}}>
								<CardContent sx={{ display: "flex", p: 2 }}>
									<Box sx={{ mr: 3 }}>
										<div
											onClick={e => {
												navigate(
													"/@" +
														comment.user[0].handle,
												);
												e.stopPropagation();
											}}>
											<Avatar
												alt="Profile Picture"
												sx={{ width: 48, height: 48 }}
											/>
										</div>
									</Box>
									<Box>
										<Typography
											variant="subtitle1"
											component="span"
											sx={{ mr: 1 }}>
											<b>{comment.user[0].name}</b>
										</Typography>

										<Typography
											variant="subtitle1"
											component="span"
											sx={{ color: "text.fade" }}>
											@{comment.user[0].handle}
										</Typography>

										<Typography
											variant="subtitle2"
											color="text.secondary">
											{comment.body}
										</Typography>
									</Box>
								</CardContent>
							</CardActionArea>

							<Box
								// comment"s actions
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-around",
									mb: 2,
								}}>
								<ButtonGroup variant="text">
									<IconButton
										size="small"
										disableRipple={true}
										sx={{
											fontSize: "20px",
											color: "text.fade",
										}}
										onClick={() => {
											if (auth)
												dispatch(
													toggleLike({
														target: comment._id,
														parent: tweet._id,
														actor: authUser._id,
													}),
												);
										}}>
										{comment.likes &&
										comment.likes.includes(authUser._id) ? (
											<FavoriteIcon
												color="error"
												sx={{ fontSize: "20px" }}
											/>
										) : (
											<FavoriteBorderIcon
												sx={{
													fontSize: "20px",
													color: "text.fade",
												}}
											/>
										)}
									</IconButton>

									<Button
										onClick={() => {
											if (
												comment.likes &&
												comment.likes.length
											)
												navigate(
													`/tweet/${comment._id}/likes`,
												);
										}}
										size="small"
										sx={{
											color: "text.fade",
											"&:hover": {
												backgroundColor: "transparent",
											},
										}}>
										{(comment.likes &&
											comment.likes.length) ||
											0}
									</Button>
								</ButtonGroup>

								<ButtonGroup variant="text">
									<IconButton
										size="small"
										disableRipple={true}
										sx={{
											fontSize: "20px",
											color: "text.fade",
										}}
										onClick={() => {
											if (auth)
												navigate(
													`/tweet/${comment._id}/share`,
												);
										}}>
										<ShareIcon
											sx={{
												fontSize: "20px",
												color: "text.fade",
											}}
										/>
									</IconButton>
									<Button
										onClick={() => {
											if (
												comment.shares &&
												comment.shares.length
											) {
												navigate(
													`/tweet/${comment._id}/shares`,
												);
											}
										}}
										size="small"
										sx={{
											color: "text.fade",
											"&:hover": {
												backgroundColor: "transparent",
											},
										}}>
										{(comment.shares &&
											comment.shares.length) ||
											0}
									</Button>
								</ButtonGroup>

								<ButtonGroup variant="text">
									<IconButton
										size="small"
										disableRipple={true}
										sx={{
											fontSize: "20px",
											color: "text.fade",
										}}
										onClick={() => {
											navigate(
												`/tweet/${comment._id}#comments`,
											);
										}}>
										<ChatBubbleIcon
											sx={{
												fontSize: "20px",
												color: "text.fade",
											}}
										/>
									</IconButton>
									<Button
										onClick={() => {
											navigate(
												`/tweet/${comment._id}#comments`,
											);
										}}
										size="small"
										sx={{
											color: "text.fade",
											"&:hover": {
												backgroundColor: "transparent",
											},
										}}>
										{(comment.comments &&
											comment.comments.length) ||
											0}
									</Button>
								</ButtonGroup>
							</Box>
						</Card>
					))}
				</div>

				{auth && (
					<Box
						// Reply form
						sx={{
							p: 2,
							pb: 3,
							mt: 4,
							bottom: 0,
							position: "sticky",
							bgcolor: "banner.background",
						}}>
						<FormControl fullWidth>
							<Input
								inputRef={input}
								sx={{ fontSize: "16px", py: 2 }}
								placeholder="Your reply"
								multiline
								fullWidth
								variant="standard"
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											onClick={() => {
												let reply = input.current.value;

												if (!reply || !auth) return;

												(async () => {
													let result =
														await postReply(
															tweet._id,
															reply,
														);
													if (!result)
														return navigate(
															"/error",
														);

													postNoti("comment", tweet._id);

													dispatch(
														addComment(result),
													);
													input.current.value = "";
												})();
											}}>
											<SendIcon color="info" />
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					</Box>
				)}
			</Box>
		)
	);
}
