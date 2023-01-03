import {
	Box,
	Alert,
	Button,
	Typography,
	OutlinedInput,
	InputAdornment,
} from '@mui/material';

import { register } from '../apiCalls';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register({ setAuth, setAuthUser }) {
	const navigate = useNavigate();

	const nameInput = useRef();
	const handleInput = useRef();
	const profileInput = useRef();
	const passwordInput = useRef();

	const [errMsg, setErrMsg] = useState('');
	const [hasError, setHasError] = useState(false);

	return (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			<Typography variant='h4' sx={{ textAlign: 'center', mb: 3 }}>
				Register
			</Typography>

			{hasError && (
				<Alert severity='warning' sx={{ mb: 3 }}>
					{errMsg}
				</Alert>
			)}

			<form
				onSubmit={e => {
					e.preventDefault();

					setHasError(false);

					let name = nameInput.current.value;
					let handle = handleInput.current.value;
					let profile = profileInput.current.value;
					let password = passwordInput.current.value;

					(async () => {
						let result = await register(
							name,
							handle,
							profile,
							password,
						);

						if (!result) {
							setErrMsg('required: name, handle, profile');
							setHasError(true);
							return;
						}

						if (result === 409) {
							setErrMsg('Handle already taken');
							setHasError(true);
							return;
						}

						setAuth(false);
						setAuthUser(result.user);
						setAuth(true);
						navigate('/');
					})();
				}}>
				<OutlinedInput
					required
					inputRef={nameInput}
					placeholder='Name'
					fullWidth={true}
					sx={{ mb: 2 }}
				/>

				<OutlinedInput
					required
					inputRef={handleInput}
					placeholder='Handle'
					fullWidth={true}
					inputProps={{ pattern: '[a-zA-Z0-9_]+' }}
					startAdornment={
						<InputAdornment position='start'>@</InputAdornment>
					}
					sx={{ mb: 2 }}
				/>

				<OutlinedInput
					multiline
					minRows={2}
					inputRef={profileInput}
					placeholder='Profile (optional)'
					fullWidth={true}
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
					color='info'
					type='submit'
					fullWidth={true}
					variant='contained'>
					Register
				</Button>
			</form>
		</Box>
	);
}
