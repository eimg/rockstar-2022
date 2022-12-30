import { useEffect, useState } from "react";
import { View } from "react-native";

import { Input, } from "@rneui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";

import { fetchUsers } from "../apiCalls";
import UserList from "./_Share/UserList";

export default function Search({ authUser, setAuthUser }) {
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		(async () => {
			let users = await fetchUsers();
			if (!users) return false;

			setUsers(users);
		})();
	}, []);

	return (
		<View style={{
			flex: 1,
			alignItems: "stretch",
			justifyContent: "flex-start",
		}}>

			<Input
				value={search}
				placeholder="User search"
				onChangeText={setSearch}
				onChange={() => {
					(async () => {
						let users = await fetchUsers(search);
						if (!users) return false;

						setUsers(users);
					})();
				}}
				leftIcon={
					<Ionicons name="person-outline" size={24} color="grey" />
				}
			/>

			<UserList authUser={authUser} setAuthUser={setAuthUser} users={users} />
		</View>
	);
}
