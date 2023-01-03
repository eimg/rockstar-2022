import { useContext } from 'react';

import {
	Box,
	List,
	Drawer,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemButton,
} from '@mui/material';

import { Delete as DeleteIcon, Flag as FlagIcon } from '@mui/icons-material';

import { useRouter } from 'next/router';
import { AuthContext } from './AuthProvider';
import { deleteTweet } from '../../utils/apiCalls';

function MenuList({ remove, toggleBottomMenu, currentTweet }) {
	const router = useRouter();
	const { authStatus, authUser } = useContext(AuthContext);

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
						<ListItemText primary='Report' />
					</ListItemButton>
				</ListItem>

				{authStatus && currentTweet.owner === authUser._id && (
					<ListItem>
						<ListItemButton
							onClick={() => {
								(async () => {
									let result = deleteTweet(currentTweet._id);
									// if (!result) navigate("/error");

									if (remove) remove(currentTweet._id);
									else router.push('/');
								})();
							}}>
							<ListItemIcon>
								<DeleteIcon color='error' />
							</ListItemIcon>
							<ListItemText primary='Delete Tweet' />
						</ListItemButton>
					</ListItem>
				)}
			</List>
		</Box>
	);
}

export default function BottomMenu({
	remove,
	toggleBottomMenu,
	bottomMenuState,
	currentTweet,
}) {
	return (
		<>
			<Drawer
				anchor='bottom'
				open={bottomMenuState}
				onClose={toggleBottomMenu(false)}>
				<MenuList
					toggleBottomMenu={toggleBottomMenu}
					currentTweet={currentTweet}
					remove={remove}
				/>
			</Drawer>
		</>
	);
}
