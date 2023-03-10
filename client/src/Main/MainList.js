import {
	Box,
	Card,
	Button,
	Avatar,
	Typography,
	IconButton,
	ButtonGroup,
	CardContent,
	CardActionArea,
} from "@mui/material";

import { green } from "@mui/material/colors";

import {
	Share as ShareIcon,
	MoreVert as MoreVertIcon,
	Favorite as FavoriteIcon,
	ChatBubble as ChatBubbleIcon,
	FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { formatRelative, parseISO } from "date-fns";

export default function MainList({
	auth,
	tweets,
	authUser,
	toggleLike,
	toggleBottomMenu,
}) {
	const navigate = useNavigate();

	return (
		<div>
			{tweets.map(tweet => {
				// undefined user protection
				if (!tweet.user[0]) return false;

				return (
					<Card sx={{ mb: 1 }} key={tweet._id} variant="outlined">
						<Box sx={{ float: "right" }}>
							<IconButton
								onClick={toggleBottomMenu(true, {
									_id: tweet._id,
									owner: tweet.owner,
								})}>
								<MoreVertIcon
									sx={{
										fontSize: "24px",
										color: "text.fade",
									}}
								/>
							</IconButton>
						</Box>

						{tweet.type === "share" && (
							<Box
								sx={{
									mt: 2,
									ml: 3,
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
									mt: 2,
									ml: 3,
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

						<CardActionArea
							onClick={() => {
								navigate("/tweet/" + tweet._id);
							}}>
							<CardContent sx={{ display: "flex", p: 2 }}>
								<Box sx={{ mr: 3 }}>
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
									<Typography sx={{ mr: 1 }} component="span">
										<b>{tweet.user[0].name}</b>
									</Typography>

									<Typography
										component="span"
										sx={{ color: "text.fade" }}>
										@{tweet.user[0].handle}
									</Typography>

									<Typography component="span" sx={{ ml: 1 }}>
										<small>
											{formatRelative(
												parseISO(tweet.created),
												new Date(),
											)}
										</small>
									</Typography>

									<Typography
										variant="subtitle1"
										color="text.secondary">
										{tweet.body}
									</Typography>
								</Box>
							</CardContent>
						</CardActionArea>

						{tweet.origin_tweet[0] && (
							<CardActionArea
								onClick={() => {
									navigate(
										"/tweet/" + tweet.origin_tweet[0]._id,
									);
								}}>
								<Card
									sx={{
										p: 2,
										mx: 3,
										my: 2,
										bgcolor: "banner.background",
									}}
									elevation={0}>
									<CardContent sx={{ display: "flex", p: 2 }}>
										<Box sx={{ mr: 3 }}>
											<div
												onClick={e => {
													navigate(
														"/@" +
															tweet
																.origin_tweet[0]
																.user[0].handle,
													);
													e.stopPropagation();
												}}>
												<Avatar
													alt="Profile Picture"
													sx={{
														width: 48,
														height: 48,
													}}
												/>
											</div>
										</Box>
										<Box>
											<Typography
												component="span"
												sx={{ mr: 1 }}
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
												sx={{
													color: "text.fade",
													mr: 1,
												}}>
												@
												{
													tweet.origin_tweet[0]
														.user[0].handle
												}
											</Typography>

											<Typography
												component="span"
												variant="body2"
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
												variant="subtitle1"
												color="text.fade"
												sx={{ fontSize: "16px" }}>
												{tweet.origin_tweet[0].body}
											</Typography>
										</Box>
									</CardContent>
								</Card>
							</CardActionArea>
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
									sx={{
										fontSize: "20px",
										color: "text.fade",
									}}
									onClick={() => {
										if (auth) toggleLike(tweet._id);
									}}>
									{tweet.likes &&
									tweet.likes.includes(authUser._id) ? (
										<FavoriteIcon
											color="error"
											sx={{
												fontSize: "20px",
											}}
										/>
									) : tweet.likes && tweet.likes.length ? (
										<FavoriteBorderIcon
											color="error"
											sx={{
												fontSize: "20px",
											}}
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
										if (tweet.likes && tweet.likes.length)
											navigate(
												`/tweet/${tweet._id}/likes`,
											);
									}}
									size="small"
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
									size="small"
									disableRipple={true}
									sx={{
										fontSize: "20px",
										color: "text.fade",
									}}
									onClick={() => {
										if (auth)
											navigate(
												`/tweet/${tweet._id}/share`,
											);
									}}>
									{tweet.shares && tweet.shares.length ? (
										<ShareIcon
											color="primary"
											sx={{
												fontSize: "20px",
											}}
										/>
									) : (
										<ShareIcon
											sx={{
												fontSize: "20px",
												color: "text.fade",
											}}
										/>
									)}
								</IconButton>

								<Button
									onClick={() => {
										if (tweet.shares && tweet.shares.length)
											navigate(
												`/tweet/${tweet._id}/shares`,
											);
									}}
									size="small"
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
									disableRipple={true}
									sx={{
										fontSize: "20px",
										color: "text.fade",
									}}
									onClick={() => {
										navigate(
											`/tweet/${tweet._id}#comments`,
										);
									}}>
									{tweet.comments && tweet.comments.length ? (
										<ChatBubbleIcon
											color="success"
											sx={{
												fontSize: "20px",
											}}
										/>
									) : (
										<ChatBubbleIcon
											sx={{
												fontSize: "20px",
												color: "text.fade",
											}}
										/>
									)}
								</IconButton>

								<Button
									size="small"
									sx={{
										color: "text.fade",
										"&:hover": {
											backgroundColor: "transparent",
										},
									}}
									onClick={() => {
										navigate(
											`/tweet/${tweet._id}#comments`,
										);
									}}>
									{(tweet.comments &&
										tweet.comments.length) ||
										0}
								</Button>
							</ButtonGroup>
						</Box>
					</Card>
				);
			})}
		</div>
	);
}
