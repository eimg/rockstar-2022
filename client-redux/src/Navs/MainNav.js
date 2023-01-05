import { useContext } from "react";

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
} from "@mui/material";

import {
	Feed as FeedIcon,
	Login as LoginIcon,
	Logout as LogoutIcon,
	Person as PersonIcon,
	DarkMode as DarkModeIcon,
	LightMode as LightModeIcon,
	PersonAddAlt as PersonAddAltIcon,
	SwitchAccount as SwitchAccountIcon,
} from "@mui/icons-material";

import { pink } from "@mui/material/colors";
import { ColorModeContext } from "../ThemedApp";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setStatus, setUser } from "../slices/authSlice";

function MenuList({ toggleDrawer }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const auth = useSelector(state => state.auth.status);
	const authUser = useSelector(state => state.auth.user);

	const setAuth = status => {
		dispatch(setStatus(status));
	}

	const setAuthUser = user => {
		dispatch(setUser(user));
	};

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
					bgcolor: "banner.background",
				}}>
				{auth && (
					<>
						<Avatar
							alt="Profile"
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
							variant="body2"
							sx={{ mb: 2, color: "text.fade" }}>
							@{authUser && authUser.handle}
						</Typography>

						<Typography
							component="span"
							sx={{ mr: 3, fontSize: 14, color: "text.fade" }}>
							<Link
								to={`/user/${authUser.handle}/following`}
								style={{
									color: pink[400],
									textDecoration: "none",
								}}>
								{(authUser.following &&
									authUser.following.length) ||
									0}{" "}
								Following
							</Link>
						</Typography>

						<Typography
							component="span"
							sx={{ fontSize: 14, color: "text.fade" }}>
							<Link
								to={`/user/${authUser.handle}/followers`}
								style={{
									color: pink[400],
									textDecoration: "none",
								}}>
								{(authUser.followers &&
									authUser.followers.length) ||
									0}{" "}
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
							navigate("/");
						}}>
						<ListItemIcon>
							<FeedIcon />
						</ListItemIcon>
						<ListItemText primary="Newsfeed" />
					</ListItemButton>
				</ListItem>

				{!auth && (
					<>
						<ListItem>
							<ListItemButton
								onClick={() => {
									navigate("/register");
								}}>
								<ListItemIcon>
									<PersonAddAltIcon />
								</ListItemIcon>
								<ListItemText primary="Register" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								onClick={() => {
									navigate("/login");
								}}>
								<ListItemIcon>
									<LoginIcon />
								</ListItemIcon>
								<ListItemText primary="Login" />
							</ListItemButton>
						</ListItem>
					</>
				)}

				{auth && (
					<>
						<ListItem>
							<ListItemButton
								onClick={() => {
									navigate(`/@${authUser.handle}`);
								}}>
								<ListItemIcon>
									<PersonIcon />
								</ListItemIcon>
								<ListItemText primary="Profile" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								onClick={() => {
									navigate("/register");
								}}>
								<ListItemIcon>
									<PersonAddAltIcon />
								</ListItemIcon>
								<ListItemText primary="Add Account" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								onClick={() => {
									navigate("/login");
								}}>
								<ListItemIcon>
									<SwitchAccountIcon />
								</ListItemIcon>
								<ListItemText primary="Switch Account" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								sx={{ color: pink[400] }}
								onClick={() => {
									localStorage.removeItem("token");
									setAuth(false);
									setAuthUser({});
									navigate("/");
								}}>
								<ListItemIcon>
									<LogoutIcon />
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItemButton>
						</ListItem>
					</>
				)}
			</List>
		</Box>
	);
}

export default function MainNav({
	theme,
	drawerState,
	toggleDrawer,
}) {
	let colorMode = useContext(ColorModeContext);

	return (
		<>
			<Drawer
				anchor="left"
				open={drawerState}
				onClose={toggleDrawer(false)}
				sx={{
					display: { md: "none", sm: "block", xs: "block" },
				}}>
				<MenuList
					toggleDrawer={toggleDrawer}
				/>

				<Divider />
				<IconButton
					color="inherit"
					disableRipple={true}
					sx={{ ml: 1, mt: 2 }}
					onClick={colorMode.toggleColorMode}>
					{theme.palette.mode === "dark" ? (
						<DarkModeIcon />
					) : (
						<LightModeIcon />
					)}
				</IconButton>
			</Drawer>

			<Drawer
				open={true}
				anchor="left"
				variant="persistent"
				onClose={toggleDrawer(false)}
				sx={{
					display: { md: "block", sm: "none", xs: "none" },
				}}>
				<MenuList
					toggleDrawer={toggleDrawer}
				/>

				<Divider />

				<IconButton
					color="inherit"
					disableRipple={true}
					sx={{ ml: 1, mt: 2 }}
					onClick={colorMode.toggleColorMode}>
					{theme.palette.mode === "dark" ? (
						<DarkModeIcon />
					) : (
						<LightModeIcon />
					)}
				</IconButton>
			</Drawer>
		</>
	);
}
