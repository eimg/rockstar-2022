import {
	Box,
	List,
	Drawer,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemButton,
} from "@mui/material";

import { Delete as DeleteIcon, Flag as FlagIcon } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { deleteTweet } from "../apiCalls";
import { useSelector } from "react-redux";

function MenuList({ toggleBottomMenu, tweetIdOwner }) {
	const navigate = useNavigate();

	const authUser = useSelector(state => state.auth.user);

	return (
		<Box
			onClick={toggleBottomMenu(false)}
			onKeyDown={toggleBottomMenu(false)}>
			<List>
				<ListItem>
					<ListItemButton disabled>
						<ListItemIcon>
							<FlagIcon />
						</ListItemIcon>
						<ListItemText primary="Report" />
					</ListItemButton>
				</ListItem>

				{tweetIdOwner && tweetIdOwner.owner === authUser._id && (
					<ListItem>
						<ListItemButton
							onClick={() => {
								(async () => {
									let result = deleteTweet(tweetIdOwner._id);
									if (!result) navigate("/error");

									navigate("/");
								})();
							}}>
							<ListItemIcon>
								<DeleteIcon color="error" />
							</ListItemIcon>
							<ListItemText primary="Delete Tweet" />
						</ListItemButton>
					</ListItem>
				)}
			</List>
		</Box>
	);
}

export default function BottomMenu({
	toggleBottomMenu,
	bottomMenuState,
	tweetIdOwner,
}) {
	return (
		<>
			<Drawer
				anchor="bottom"
				open={bottomMenuState}
				onClose={toggleBottomMenu(false)}>
				<MenuList
					tweetIdOwner={tweetIdOwner}
					toggleBottomMenu={toggleBottomMenu}
				/>
			</Drawer>
		</>
	);
}
