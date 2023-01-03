import Head from 'next/head';

import {
	Box,
	Alert,
	Button,
	Typography,
	OutlinedInput,
	InputAdornment,
} from '@mui/material';

import { useState, useRef, useContext } from 'react';
import { login } from '../utils/apiCalls';
import { useRouter } from 'next/router';
import { AuthContext } from './components/AuthProvider';

import Layout from './components/Layout';

export default function Login() {
	const { setAuthUser, setAuthStatus } = useContext(AuthContext);

	const router = useRouter();

	const handleInput = useRef();
	const passwordInput = useRef();

	const [hasError, setHasError] = useState(false);

	return (
		<>
			<Head>
				<title>Next Twitter</title>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
					<Typography
						variant='h4'
						sx={{ textAlign: 'center', mb: 3 }}>
						Login
					</Typography>

					{hasError && (
						<Alert severity='warning' sx={{ mb: 3 }}>
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

								setAuthStatus(true);
								setAuthUser(result.user);
								router.push('/');
							})();
						}}>
						<OutlinedInput
							required
							inputRef={handleInput}
							placeholder='Handle'
							fullWidth={true}
							startAdornment={
								<InputAdornment position='start'>
									@
								</InputAdornment>
							}
							sx={{ mb: 2 }}
						/>

						<OutlinedInput
							required
							inputRef={passwordInput}
							placeholder='Password'
							fullWidth={true}
							inputProps={{ type: 'password' }}
							sx={{ mb: 3 }}
						/>

						<Button
							type='submit'
							variant='contained'
							color='info'
							fullWidth={true}>
							Login
						</Button>
					</form>
				</Box>
			</main>
		</>
	);
}
