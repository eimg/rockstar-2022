import { Box, Button, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			<Typography variant="h3" sx={{ mb: 2 }}>
				Oops!
			</Typography>
			404 Not Found.
			<Button
				sx={{ ml: 2 }}
				onClick={() => {
					navigate("/");
				}}>
				Go Back
			</Button>
		</Box>
	);
}
