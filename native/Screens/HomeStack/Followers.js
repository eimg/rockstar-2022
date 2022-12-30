import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import {
	ListItem,
	Avatar
} from "@rneui/themed";

import FollowButton from "../_Share/FollowButton";
import { fetchFollowers } from "../../apiCalls";

export default function Followers({ authUser, setAuthUser }) {
	const route = useRoute();
	const navigation = useNavigation();

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
		<ScrollView>
			<View style={{
				flex: 1,
				padding: 20,
				alignItems: "stretch",
				justifyContent: "flex-start",
			}}>
				{followers.map(user => {
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

								<FollowButton 
									authUser={authUser} 
									user={user} 
									setAuthUser={setAuthUser} 
								/>
							</ListItem>
						</TouchableOpacity>
					)
				})}
			</View>
		</ScrollView>
	);
}
