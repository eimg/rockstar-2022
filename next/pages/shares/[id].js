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
import { fetchShares } from '../../utils/apiCalls';
import { useRouter } from 'next/router';

import FollowButton from '../components/FollowButton';

export default function Shares() {
	const router = useRouter();
	const { id } = router.query;

	const [shares, setShares] = useState([]);

	useEffect(() => {
		(async () => {
			let result = await fetchShares(id);
			// if (!result) navigate("/error");

			if (result) {
				setShares(result);
			}
		})();
	}, [id]);

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
						{shares.map(share => {
							return (
								<ListItem
									key={share.user[0]._id}
									secondaryAction={
										<FollowButton user={share.user[0]} />
									}>
									<ListItemAvatar>
										<Link
											href={`/@${share.user[0].handle}`}>
											<Avatar alt='Profile'></Avatar>
										</Link>
									</ListItemAvatar>
									<ListItemText
										primary={
											share.user[0].name +
											' @' +
											share.user[0].handle
										}
										secondary={share.body}
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
