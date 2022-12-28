import { useEffect, useState } from "react";

import {
	AppBar,
	Toolbar,
	IconButton,
	Badge
} from "@mui/material";

import {
	Hub as HubIcon,
	ArrowBack as ArrowBackIcon,
	PersonSearch as PersonSearchIcon,
	Notifications as NotificationsIcon,
	AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";

import { fetchNotis } from "../apiCalls";

import Search from "./Search";

export default function Header({
	auth,
	notiCount,
	setNotiCount,
	toggleDrawer,
}) {
	const location = useLocation();
	const navigate = useNavigate();

	const [searchOpen, setSearchOpen] = useState(false);

	useEffect(() => {
		(async () => {
			if (auth) {
				let result = await fetchNotis();
				if (!result) return navigate("/error");

				setNotiCount(result.filter(noti => !noti.read).length);
			}
		})();
	}, [setNotiCount, auth, navigate]);

	return (
		<AppBar
			elevation={1}
			position="static"
			sx={{ bgcolor: "appbar.background" }}
		>
			<Toolbar>
				{
					location.pathname === "/"
						? <IconButton
							size="large"
							edge="start"
							color="inherit"
							sx={{ mr: 2, display: { md: "none" } }}
							onClick={toggleDrawer(true)}
						>
							<AccountCircleIcon />
						</IconButton>
						: <IconButton
							size="large"
							edge="start"
							color="inherit"
							onClick={() => {
								navigate(-1);
							}}
						>
							<ArrowBackIcon />
						</IconButton>
				}

				<IconButton
					disableRipple={true}
					sx={{ flexGrow: 1, textAlign: "center" }}
					onClick={() => {
						navigate("/");
					}}
				>
					<HubIcon sx={{ color: "logo.color", fontSize: 38 }} />
				</IconButton>

				<IconButton
					sx={{ mr: 1 }}
					onClick={() => {
						setSearchOpen(true);
					}}
				>
					<PersonSearchIcon />
				</IconButton>

				{auth && <IconButton color="inherit" onClick={() => {
					navigate("/notis");
				}}>
					{notiCount > 0
						? <Badge
							variant="dot"
							color="noti"
							overlap="circular"
						>
							<NotificationsIcon />
						</Badge>

						: <NotificationsIcon />
					}
				</IconButton>}
			</Toolbar>

			<Search open={searchOpen} setOpen={setSearchOpen} />
		</AppBar>
	);
}
