import { useContext } from 'react';

import {
	Box,
	List,
	Avatar,
	Drawer,
	Divider,
	ListItem,
	IconButton,
	Typography,
	ListItemIcon,
	ListItemText,
	ListItemButton,
	useTheme,
} from '@mui/material';

import {
	Feed as FeedIcon,
	Login as LoginIcon,
	Logout as LogoutIcon,
	Person as PersonIcon,
	DarkMode as DarkModeIcon,
	LightMode as LightModeIcon,
	PersonAddAlt as PersonAddAltIcon,
	SwitchAccount as SwitchAccountIcon,
} from '@mui/icons-material';

import { pink } from '@mui/material/colors';
import { ColorModeContext } from './Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { AuthContext } from './AuthProvider';

function MenuList({ toggleDrawer }) {
	const router = useRouter();

	const { authStatus, setAuthStatus, authUser, setAuthUser } =
		useContext(AuthContext);

	return (
		<Box
			// Container
			sx={{ width: 280 }}
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}>
			<Box
				// Profile Banner
				sx={{
					p: 3,
					mb: 2,
					minHeight: 150,
					bgcolor: 'banner.background',
				}}>
				{authStatus && (
					<>
						<Avatar
							alt='Profile'
							sx={{
								mb: 3,
								width: 64,
								height: 64,
								bgcolor: pink[500],
							}}
						/>

						<Typography>
							<b>{authUser && authUser.name}</b>
						</Typography>

						<Typography
							variant='body2'
							sx={{ mb: 2, color: 'text.fade' }}>
							@{authUser && authUser.handle}
						</Typography>

						<Typography
							component='span'
							sx={{ mr: 3, fontSize: 14, color: 'text.fade' }}>
							<Link
								href={`/following/${authUser.handle}`}
								style={{
									color: pink[400],
									textDecoration: 'none',
								}}>
								{(authUser.following &&
									authUser.following.length) ||
									0}{' '}
								Following
							</Link>
						</Typography>

						<Typography
							component='span'
							sx={{ fontSize: 14, color: 'text.fade' }}>
							<Link
								href={`/followers/${authUser.handle}`}
								style={{
									color: pink[400],
									textDecoration: 'none',
								}}>
								{(authUser.followers &&
									authUser.followers.length) ||
									0}{' '}
								Followers
							</Link>
						</Typography>
					</>
				)}
			</Box>

			<List>
				<ListItem>
					<ListItemButton
						onClick={() => {
							router.push('/');
						}}>
						<ListItemIcon>
							<FeedIcon />
						</ListItemIcon>
						<ListItemText primary='Newsfeed' />
					</ListItemButton>
				</ListItem>

				{!authStatus && (
					<>
						<ListItem>
							<ListItemButton
								onClick={() => {
									router.push('/register');
								}}>
								<ListItemIcon>
									<PersonAddAltIcon />
								</ListItemIcon>
								<ListItemText primary='Register' />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								onClick={() => {
									router.push('/login');
								}}>
								<ListItemIcon>
									<LoginIcon />
								</ListItemIcon>
								<ListItemText primary='Login' />
							</ListItemButton>
						</ListItem>
					</>
				)}

				{authStatus && (
					<>
						<ListItem>
							<ListItemButton
								onClick={() => {
									router.push(`/@${authUser.handle}`);
								}}>
								<ListItemIcon>
									<PersonIcon />
								</ListItemIcon>
								<ListItemText primary='Profile' />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								onClick={() => {
									router.push('/register');
								}}>
								<ListItemIcon>
									<PersonAddAltIcon />
								</ListItemIcon>
								<ListItemText primary='Add Account' />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								onClick={() => {
									router.push('/login');
								}}>
								<ListItemIcon>
									<SwitchAccountIcon />
								</ListItemIcon>
								<ListItemText primary='Switch Account' />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								sx={{ color: pink[400] }}
								onClick={() => {
									localStorage.removeItem('token');
									setAuthStatus(false);
									setAuthUser({});
									router.push('/');
								}}>
								<ListItemIcon>
									<LogoutIcon />
								</ListItemIcon>
								<ListItemText primary='Logout' />
							</ListItemButton>
						</ListItem>
					</>
				)}
			</List>
		</Box>
	);
}

export default function Nav({ drawerState, toggleDrawer }) {
	const colorMode = useContext(ColorModeContext);
	const theme = useTheme();

	return (
		<>
			<Drawer
				anchor='left'
				open={drawerState}
				onClose={toggleDrawer(false)}
				sx={{
					display: { md: 'none', sm: 'block', xs: 'block' },
				}}>
				<MenuList toggleDrawer={toggleDrawer} />

				<Divider />
				<IconButton
					color='inherit'
					disableRipple={true}
					sx={{ ml: 1, mt: 2 }}
					onClick={colorMode.toggleColorMode}>
					{theme.palette.mode === 'dark' ? (
						<DarkModeIcon />
					) : (
						<LightModeIcon />
					)}
				</IconButton>
			</Drawer>

			<Drawer
				open={true}
				anchor='left'
				variant='persistent'
				onClose={toggleDrawer(false)}
				sx={{
					display: { md: 'block', sm: 'none', xs: 'none' },
				}}>
				<MenuList toggleDrawer={toggleDrawer} />

				<Divider />

				<IconButton
					color='inherit'
					disableRipple={true}
					sx={{ ml: 1, mt: 2 }}
					onClick={colorMode.toggleColorMode}>
					{theme.palette.mode === 'dark' ? (
						<DarkModeIcon />
					) : (
						<LightModeIcon />
					)}
				</IconButton>
			</Drawer>
		</>
	);
}
