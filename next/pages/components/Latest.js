import { Box } from '@mui/material';

import TweetList from './TweetList';

export default function Latest({ remove, tweets, toggleLike }) {
	return (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			<TweetList
				remove={remove}
				tweets={tweets}
				toggleLike={toggleLike}
			/>
		</Box>
	);
}
