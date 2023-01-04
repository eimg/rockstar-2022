import { useEffect, useRef, useState } from "react";

import {
	Box,
	List,
	Modal,
	Avatar,
	ListItem,
	ListItemText,
	OutlinedInput,
	InputAdornment,
	ListItemButton,
	ListItemAvatar,
} from "@mui/material";

import { PersonSearch as PersonSearchIcon } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { fetchUsers } from "../apiCalls";

const style = {
	position: "absolute",
	top: {
		lg: "10%",
		md: "10%",
		sm: "5%",
	},
	left: {
		lg: "20%",
		md: "20%",
		sm: "5%",
	},
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
	width: {
		lg: "60%",
		md: "60%",
		sm: "90%",
	},
};

export default function Search({ open, setOpen }) {
	const input = useRef();
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);

	const handleClose = () => setOpen(false);

	useEffect(() => {
		(async () => {
			let users = await fetchUsers();
			if (!users) return false;

			setUsers(users);
		})();
	}, []);

	return (
		<div>
			<Modal open={open} onClose={handleClose}>
				<Box sx={style}>
					<OutlinedInput
						fullWidth={true}
						inputRef={input}
						variant="outlined"
						placeholder="Search user"
						startAdornment={
							<InputAdornment position="start">
								<PersonSearchIcon />
							</InputAdornment>
						}
						onKeyUp={() => {
							(async () => {
								let users = await fetchUsers(
									input.current.value,
								);
								if (!users) return false;

								setUsers(users);
							})();
						}}
					/>
					<List>
						{users.map(user => {
							return (
								<ListItem key={user._id}>
									<ListItemButton
										onClick={() => {
											handleClose();
											navigate(`/@${user.handle}`);
										}}>
										<ListItemAvatar>
											<Avatar alt="Profile"></Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={
												user.name + " @" + user.handle
											}
											secondary={user.profile}
										/>
									</ListItemButton>
								</ListItem>
							);
						})}
					</List>
				</Box>
			</Modal>
		</div>
	);
}
