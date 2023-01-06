import { Box } from "@mui/material";

import MainList from "./MainList";

export default function Home({ tweets, toggleLike, toggleBottomMenu }) {
	return (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			<MainList
				tweets={tweets}
				toggleBottomMenu={toggleBottomMenu}
			/>
		</Box>
	);
}
