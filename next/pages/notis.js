import Head from 'next/head';
import {
	Box,
	Card,
	Avatar,
	Button,
	Typography,
	CardContent,
	CardActionArea,
} from '@mui/material';

import {
	Share as ShareIcon,
	Comment as CommentIcon,
	Favorite as FavoriteIcon,
} from '@mui/icons-material';

import { useState, useEffect } from 'react';

import { formatRelative, parseISO } from 'date-fns';

import { fetchNotis, markAllNotisRead, markNotiRead } from '../utils/apiCalls';

import { useRouter } from 'next/router';

import Layout from './components/Layout';

export default function Notis() {
	const router = useRouter();

	const [notis, setNotis] = useState([]);

	useEffect(() => {
		(async () => {
			let result = await fetchNotis();
			// if (!result) return navigate("/error");

			if (result) {
				setNotis(result);
			}
		})();
	}, []);

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
				<Layout>
					<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
						<Box sx={{ display: 'flex', mb: 2 }}>
							<Box sx={{ flex: 1 }}></Box>
							<Button
								size='small'
								variant='outlined'
								sx={{ borderRadius: 5 }}
								onClick={() => {
									markAllNotisRead();

									setNotis(
										notis.map(noti => {
											noti.read = true;
											return noti;
										}),
									);
								}}>
								Mark all as read
							</Button>
						</Box>

						{notis.map(noti => {
							return (
								<Card key={noti._id}>
									<CardActionArea
										onClick={() => {
											markNotiRead(noti._id);
											router.push(
												`/tweet/${noti.target}`,
											);
										}}>
										<CardContent
											sx={{
												display: 'flex',
												opacity: noti.read ? 0.4 : 1,
											}}>
											{noti.type === 'comment' ? (
												<CommentIcon color='success' />
											) : noti.type === 'share' ? (
												<ShareIcon color='primary' />
											) : (
												<FavoriteIcon color='error' />
											)}

											<Box sx={{ ml: 3 }}>
												<Avatar alt='Profile'></Avatar>

												<Box sx={{ mt: 1 }}>
													<Typography
														component='span'
														sx={{ mr: 1 }}>
														<b>
															{noti.user[0].name}
														</b>
													</Typography>

													<Typography
														component='span'
														sx={{
															mr: 1,
															color: 'text.secondary',
														}}>
														{noti.msg}
													</Typography>

													<Typography
														component='span'
														color='primary'>
														<small>
															{formatRelative(
																parseISO(
																	noti.created,
																),
																new Date(),
															)}
														</small>
													</Typography>
												</Box>
											</Box>
										</CardContent>
									</CardActionArea>
								</Card>
							);
						})}
					</Box>
				</Layout>
			</main>
		</>
	);
}
