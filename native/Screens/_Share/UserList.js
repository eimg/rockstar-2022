import { View, ScrollView, TouchableOpacity } from "react-native";
import { ListItem, Avatar } from "@rneui/themed";

import { useNavigation } from "@react-navigation/native";

import FollowButton from "./FollowButton";

export default function Shares({ authUser, setAuthUser, users }) {
	const navigation = useNavigation();

	return (
		<ScrollView>
			<View style={{
				flex: 1,
				padding: 20,
				alignItems: "stretch",
				justifyContent: "flex-start",
			}}>
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
									<ListItem.Title>
										{`${user.name} @${user.handle}`}
									</ListItem.Title>
									<ListItem.Subtitle>
										{user.profile}
									</ListItem.Subtitle>
								</ListItem.Content>

								<FollowButton
									user={user}
									authUser={authUser}
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
