import { useEffect, useState } from "react";

import { useRoute } from "@react-navigation/native";

import { fetchFollowers } from "../../apiCalls";
import UserList from "../_Share/UserList";

export default function Followers({ authUser, setAuthUser }) {
	const route = useRoute();

	const [followers, setFollowers] = useState([]);
	const { handle } = route.params;

	useEffect(() => {
		(async () => {
			let result = await fetchFollowers(handle);
			// handle api error here

			setFollowers(result);
		})();
	}, [handle]);

	return (
		<UserList authUser={authUser} setAuthUser={setAuthUser} users={followers} />
	);
}
