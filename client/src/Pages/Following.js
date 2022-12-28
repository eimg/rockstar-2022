import { useState, useEffect } from "react";

import {
	Box,
	List,
	Avatar,
	ListItem,
	ListItemText,
	ListItemAvatar,
} from "@mui/material";

import { fetchFollowing } from "../apiCalls";
import FollowButton from "../Components/FollowButton";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function Following({ authUser, setAuthUser }) {
	const { handle } = useParams();
	const [following, setFollowing] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			let result = await fetchFollowing(handle);
			if (!result) navigate("/error");

			setFollowing(result);
		})();
	}, [handle, navigate]);

	return (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			<List>
				{following.map(user => {
					return (
						<ListItem
							key={user._id}
							secondaryAction={
								<FollowButton
									authUser={authUser}
									setAuthUser={setAuthUser}
									user={user}
								/>
							}
						>
							<ListItemAvatar>
								<Link to={`/@${user.handle}`}>
									<Avatar alt="Profile"></Avatar>
								</Link>
							</ListItemAvatar>
							<ListItemText
								primary={user.name + " @" + user.handle}
								secondary={user.profile}
							/>
						</ListItem>
					)
				})}
			</List>
		</Box>
	);
}
