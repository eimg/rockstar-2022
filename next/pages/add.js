import Head from "next/head";

import { Box, Input, Avatar, Button } from "@mui/material";

import { useRef } from "react";
import { postTweet } from "../utils/apiCalls";
import { useRouter } from "next/router";

export default function Add() {
	const router = useRouter();
	const input = useRef();

	return (
		<>
			<Head>
				<title>Next Twitter</title>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
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
									// if (!result) return navigate("/error");

									router.push("/");
									// setSnackbarOpen(true);
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
			</main>
		</>
	);
}
