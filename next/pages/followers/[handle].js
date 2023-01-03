import Head from 'next/head';
import Link from 'next/link';
import {
	Box,
	List,
	Avatar,
	ListItem,
	ListItemText,
	ListItemAvatar,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { fetchFollowers } from '../../utils/apiCalls';
import { useRouter } from 'next/router';

import FollowButton from '../components/FollowButton';

export default function Likes() {
	const router = useRouter();
	const { handle } = router.query;

	const [followers, setFollowers] = useState([]);

	useEffect(() => {
		(async () => {
			let result = await fetchFollowers(handle);
			// if (!result) navigate("/error");

			if (result) {
				setFollowers(result);
			}
		})();
	}, [handle]);

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
					<List>
						{followers.map(user => {
							return (
								<ListItem
									key={user._id}
									secondaryAction={
										<FollowButton user={user} />
									}>
									<ListItemAvatar>
										<Link href={`/@${user.handle}`}>
											<Avatar alt='Profile'></Avatar>
										</Link>
									</ListItemAvatar>
									<ListItemText
										primary={user.name + ' @' + user.handle}
										secondary={user.profile}
									/>
								</ListItem>
							);
						})}
					</List>
				</Box>
			</main>
		</>
	);
}
