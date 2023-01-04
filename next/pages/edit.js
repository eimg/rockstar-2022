import Head from "next/head";

import {
	Box,
	Alert,
	Button,
	Typography,
	OutlinedInput,
	InputAdornment,
} from "@mui/material";

import { useContext, useRef, useState } from "react";
import { updateProfile } from "../utils/apiCalls";
import { useRouter } from "next/router";
import { AuthContext } from "./components/AuthProvider";

export default function Edit() {
	const { authUser, setAuthUser } = useContext(AuthContext);
	const router = useRouter();

	const nameInput = useRef();
	const profileInput = useRef();
	const passwordInput = useRef();

	const [errMsg, setErrMsg] = useState("");
	const [hasError, setHasError] = useState(false);
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
					<Typography
						variant="h4"
						sx={{ textAlign: "center", mb: 3 }}>
						Edit Profile
					</Typography>

					{hasError && (
						<Alert severity="warning" sx={{ mb: 3 }}>
							{errMsg}
						</Alert>
					)}

					<form
						onSubmit={e => {
							e.preventDefault();

							setHasError(false);

							let name = nameInput.current.value;
							let profile = profileInput.current.value;
							let password = passwordInput.current.value;

							(async () => {
								let result = await updateProfile(
									authUser._id,
									name,
									profile,
									password,
								);

								if (!result) {
									setErrMsg("required: name and password");
									setHasError(true);
									return;
								}

								setAuthUser(result);
								router.push(`/@/${authUser.handle}`);
							})();
						}}>
						<OutlinedInput
							required
							inputRef={nameInput}
							placeholder="Name"
							fullWidth={true}
							sx={{ mb: 2 }}
							defaultValue={authUser.name}
						/>

						<OutlinedInput
							disabled
							placeholder="Handle"
							fullWidth={true}
							inputProps={{ pattern: "[a-zA-Z0-9_]+" }}
							startAdornment={
								<InputAdornment position="start">
									@
								</InputAdornment>
							}
							sx={{ mb: 2 }}
							defaultValue={authUser.handle}
						/>

						<OutlinedInput
							multiline
							minRows={2}
							inputRef={profileInput}
							placeholder="Profile (optional)"
							fullWidth={true}
							sx={{ mb: 2 }}
							defaultValue={authUser.profile}
						/>

						<OutlinedInput
							inputRef={passwordInput}
							placeholder="Password (leave blank to unchange)"
							fullWidth={true}
							inputProps={{ type: "password" }}
							sx={{ mb: 3 }}
						/>

						<Button
							color="info"
							type="submit"
							fullWidth={true}
							variant="contained">
							Update
						</Button>
					</form>
				</Box>
			</main>
		</>
	);
}
