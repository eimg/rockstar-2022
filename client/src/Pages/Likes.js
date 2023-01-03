import { useState, useEffect } from 'react';

import {
	Box,
	List,
	Avatar,
	ListItem,
	ListItemText,
	ListItemAvatar,
} from '@mui/material';

import { fetchLikes } from '../apiCalls';
import FollowButton from '../Components/FollowButton';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function Likes({ authUser, setAuthUser }) {
	const { id } = useParams();
	const [likes, setLikes] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			let result = await fetchLikes(id);
			if (!result) navigate('/error');

			setLikes(result);
		})();
	}, [id, navigate]);

	return (
		<Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
			<List>
				{likes.map(user => {
					return (
						<ListItem
							key={user._id}
							secondaryAction={
								<FollowButton
									authUser={authUser}
									user={user}
									setAuthUser={setAuthUser}
								/>
							}>
							<ListItemAvatar>
								<Link to={`/@${user.handle}`}>
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
	);
}
