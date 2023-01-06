import { Box } from "@mui/system";

import { Avatar, Button, Input } from "@mui/material";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { postTweet } from "../apiCalls";

import { useDispatch } from "react-redux";
import { setSnackbarOpen } from "../slices/uiSlice";
import { addTweet } from "../slices/appSlice";

export default function AddTweet() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const input = useRef();

	return (
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
						if (!newTweet) return;

						(async () => {
							let result = await postTweet(newTweet);
							if (!result) return navigate("/error");

							dispatch(setSnackbarOpen(true));
							dispatch(addTweet(result));
							navigate("/");
						})();
					}}>
					Add Post
				</Button>
			</Box>
			<Box sx={{ p: 2, border: 1, borderColor: "text.fade" }}>
				<Input
					inputRef={input}
					sx={{ fontSize: "16px", py: 2 }}
					placeholder="Enter your tweet"
					multiline
					fullWidth
					minRows={4}
				/>
			</Box>
		</Box>
	);
}
