import { Box } from "@mui/system";

import {
	Avatar,
	Button,
	Input,
	Card,
	CardContent,
	Typography,
} from "@mui/material";

import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatRelative, parseISO } from "date-fns";

import { fetchTweet, postNoti, postShare } from "../apiCalls";
import { useDispatch } from "react-redux";
import { setSnackbarOpen } from "../slices/uiSlice";
import { addTweet } from "../slices/appSlice";

import Loading from "../Utils/Loading";

export default function AddShare() {
	const navigate = useNavigate();
	const { id } = useParams();

	const input = useRef();

	const dispatch = useDispatch();

	const [tweet, setTweet] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			let tweet = await fetchTweet(id);
			if (!tweet) return navigate("/error");

			setTweet(tweet);
			setIsLoading(false);
		})();
	}, [id, navigate]);

	return isLoading ? (
		<Loading />
	) : (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			<Box
				sx={{
					display: "flex",
					mb: 2,
					justifyContent: "space-between",
				}}>
				<Avatar alt="Profile" />

				<Button
					size="small"
					variant="contained"
					color="success"
					sx={{ borderRadius: 5 }}
					onClick={() => {
						let newTweet = input.current.value;

						(async () => {
							let result = await postShare(id, newTweet);
							if (!result) return navigate("/error");

							postNoti("share", id);

							dispatch(addTweet(result));
							dispatch(setSnackbarOpen(true));
							navigate("/");
						})();
					}}>
					Share
				</Button>
			</Box>

			<Box sx={{ p: 2, border: 1, borderColor: "text.fade" }}>
				<Input
					multiline
					fullWidth
					minRows={4}
					inputRef={input}
					placeholder="Enter your remark"
					sx={{ fontSize: "16px", py: 2 }}
				/>
			</Box>

			<Card sx={{ p: 2, mt: 4 }}>
				<CardContent sx={{ display: "flex", p: 2 }}>
					<Box sx={{ mr: 3 }}>
						<Avatar
							alt="Profile Picture"
							sx={{ width: 48, height: 48 }}
						/>
					</Box>

					<Box>
						<Typography
							sx={{ mr: 1 }}
							color="text.secondary"
							component="span">
							<b>{tweet.user[0].name}</b>
						</Typography>

						<Typography
							component="span"
							sx={{ color: "text.fade", mr: 1 }}>
							@{tweet.user[0].handle}
						</Typography>

						<Typography
							component="span"
							variant="body2"
							sx={{ color: "text.fade" }}>
							{formatRelative(
								parseISO(tweet.created),
								new Date(),
							)}
						</Typography>

						<Typography
							variant="subtitle1"
							color="text.fade"
							sx={{ fontSize: "16px" }}>
							{tweet.body}
						</Typography>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
