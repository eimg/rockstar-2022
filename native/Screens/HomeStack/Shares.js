import { useEffect, useState } from "react";

import { useRoute } from "@react-navigation/native";

import UserList from "../_Share/UserList";

import { fetchShares } from "../../apiCalls";

export default function Shares({ authUser, setAuthUser }) {
	const route = useRoute();

	const [sharedUsers, setSharedUsers] = useState([]);
	const { id } = route.params;

	useEffect(() => {
		(async () => {
			let result = await fetchShares(id);
			// handle api error here

			setSharedUsers(result.map(share => share.user[0]));
		})();
	}, [id]);

	return (
		<UserList
			authUser={authUser}
			setAuthUser={setAuthUser}
			users={sharedUsers}
		/>
	);
}
