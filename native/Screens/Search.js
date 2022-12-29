import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";

import {
	ListItem,
	Avatar,
	Input,
} from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";

import { fetchUsers } from "../apiCalls";

export default function Search() {
	const navigation = useNavigation();
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
		<ScrollView>
			<View style={{
				flex: 1,
				padding: 20,
				alignItems: "stretch",
				justifyContent: "flex-start",
			}}>

				<Input
					placeholder="User search"
					value={search}
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

				{users.map(user => {
					return (
						<TouchableOpacity key={user._id} onPress={() => {
							navigation.navigate("User", { handle: user.handle });
						}}>
							<ListItem bottomDivider>

								<Avatar
									rounded
									title={user.name[0].toUpperCase()}
									size={32}
									containerStyle={{ backgroundColor: "#05a" }}
								/>
								<ListItem.Content>
									<ListItem.Title>{user.name}</ListItem.Title>
									<ListItem.Subtitle>{user.handle}</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						</TouchableOpacity>
					)
				})}
			</View>
		</ScrollView>
	);
}
