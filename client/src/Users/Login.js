import {
	Box,
	Alert,
	Button,
	Typography,
	OutlinedInput,
	InputAdornment,
} from "@mui/material";

import { login } from "../apiCalls";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuth, setAuthUser }) {
	const handleInput = useRef();
	const passwordInput = useRef();

	const navigate = useNavigate();

	const [hasError, setHasError] = useState(false);

	return (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			<Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
				Login
			</Typography>

			{hasError && (
				<Alert severity="warning" sx={{ mb: 3 }}>
					Handle or password incorrect
				</Alert>
			)}

			<form
				onSubmit={e => {
					e.preventDefault();

					setHasError(false);

					const handle = handleInput.current.value;
					const password = passwordInput.current.value;

					(async () => {
						let result = await login(handle, password);
						if (!result) return setHasError(true);

						setAuth(true);
						setAuthUser(result.user);
						navigate("/");
					})();
				}}>
				<OutlinedInput
					required
					inputRef={handleInput}
					placeholder="Handle"
					fullWidth={true}
					startAdornment={
						<InputAdornment position="start">@</InputAdornment>
					}
					sx={{ mb: 2 }}
				/>

				<OutlinedInput
					required
					inputRef={passwordInput}
					placeholder="Password"
					fullWidth={true}
					inputProps={{ type: "password" }}
					sx={{ mb: 3 }}
				/>

				<Button
					type="submit"
					variant="contained"
					color="info"
					fullWidth={true}>
					Login
				</Button>
			</form>
		</Box>
	);
}
