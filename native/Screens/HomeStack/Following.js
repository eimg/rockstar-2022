import { useEffect, useState } from "react";

import { useRoute } from "@react-navigation/native";

import { fetchFollowing } from "../../apiCalls";
import UserList from "../_Share/UserList";

export default function Following({ authUser, setAuthUser }) {
	const route = useRoute();

	const [following, setFollowing] = useState([]);
	const { handle } = route.params;

	useEffect(() => {
		(async () => {
			let result = await fetchFollowing(handle);
			// handle api error here

			setFollowing(result);
		})();
	}, [handle]);

	return (
		<UserList
			authUser={authUser}
			setAuthUser={setAuthUser}
			users={following}
		/>
	);
}
