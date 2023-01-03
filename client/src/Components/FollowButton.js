import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { putFollow } from '../apiCalls';

export default function FollowButton({ authUser, user, setAuthUser }) {
	const navigate = useNavigate();

	if (!authUser._id || authUser._id === user._id) {
		return <></>;
	}

	return authUser.following &&
		authUser.following.find(uid => uid === user._id) ? (
		<Button
			size='small'
			edge='end'
			variant='outlined'
			sx={{ borderRadius: 5 }}
			onClick={() => {
				(async () => {
					let result = await putFollow(user._id);
					if (!result) navigate('/error');

					authUser.following = result.following;

					setAuthUser({ ...authUser });
				})();
			}}>
			Followed
		</Button>
	) : (
		<Button
			size='small'
			edge='end'
			variant='contained'
			sx={{ borderRadius: 5 }}
			onClick={() => {
				(async () => {
					let result = await putFollow(user._id);
					if (!result) navigate('/error');

					authUser.following = result.following;

					setAuthUser({ ...authUser });
				})();
			}}>
			Follow
		</Button>
	);
}
