import { useState, useEffect } from "react";

import {
	Box,
	List,
	Avatar,
	ListItem,
	ListItemText,
	ListItemAvatar,
} from "@mui/material";

import { fetchShares } from "../apiCalls";
import FollowButton from "../Components/FollowButton";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function Shares({ authUser, setAuthUser }) {
	const navigate = useNavigate();
	const { id } = useParams();

	const [shares, setShares] = useState([]);

	useEffect(() => {
		(async () => {
			let result = await fetchShares(id);
			if (!result) return navigate("/error");

			setShares(result);
		})();
	}, [id, navigate]);

	return (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			<List>
				{shares.map(share => {
					return (
						<ListItem
							key={share.user[0]._id}
							secondaryAction={
								<FollowButton
									authUser={authUser}
									user={share.user[0]}
									setAuthUser={setAuthUser}
								/>
							}
						>
							<ListItemAvatar>
								<Link to={`/@${share.user[0].handle}`}>
									<Avatar alt="Profile"></Avatar>
								</Link>
							</ListItemAvatar>
							<ListItemText
								primary={share.user[0].name + " @" + share.user[0].handle}
								secondary={share.body}
							/>
						</ListItem>
					)
				})}
			</List>
		</Box>
	);
}
