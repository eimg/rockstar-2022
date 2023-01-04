import { useEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";

import { Text, Avatar, useTheme } from "@rneui/themed";

import { useNavigation, useRoute } from "@react-navigation/native";

import { fetchUserByHandle } from "../../apiCalls";
import UserContents from "../_Share/UserContents";
import FollowButton from "../_Share/FollowButton";

export default function User({ authUser, auth, setAuthUser }) {
	const navigation = useNavigation();

	const { theme } = useTheme();

	const route = useRoute();
	const [user, setUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	const { handle } = route.params;

	useEffect(() => {
		setIsLoading(true);

		(async () => {
			let user = await fetchUserByHandle(handle);
			setUser(user);

			setIsLoading(false);
		})();
	}, [handle]);

	return (
		!isLoading && (
			<View
				style={{
					flex: 1,
					alignItems: "stretch",
					justifyContent: "center",
				}}>
				<ScrollView>
					<View
						style={{
							backgroundColor: theme.colors.primary,
							height: 100,
						}}></View>

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginHorizontal: 20,
						}}>
						<View style={{ marginTop: -50 }}>
							<Avatar
								rounded
								size={98}
								title={user.name[0].toUpperCase()}
								containerStyle={{ backgroundColor: "#0a5" }}
							/>
							<View style={{ marginTop: 10, marginLeft: 10 }}>
								<Text
									style={{
										fontWeight: "bold",
										fontSize: 20,
									}}>
									{user.name}
									<Text
										style={{
											marginLeft: 6,
											color: "grey",
										}}>
										@{user.handle}
									</Text>
								</Text>

								<Text style={{ marginTop: 10 }}>
									{user.profile}
								</Text>
							</View>
							<View
								style={{
									marginLeft: 10,
									marginTop: 15,
									flexDirection: "row",
								}}>
								<TouchableOpacity
									onPress={() => {
										navigation.navigate("Following", {
											handle: user.handle,
										});
									}}>
									<Text
										style={{ fontSize: 16, color: "#09c" }}>
										{user.following_users.length} Followings
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => {
										navigation.navigate("Followers", {
											handle: user.handle,
										});
									}}>
									<Text
										style={{
											marginLeft: 10,
											fontSize: 16,
											color: "#09c",
										}}>
										{user.followers_users.length} Followers
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						{auth && (
							<View
								style={{
									marginTop: 10,
								}}>
								<FollowButton
									authUser={authUser}
									user={user}
									setAuthUser={setAuthUser}
								/>
							</View>
						)}
					</View>

					<UserContents
						auth={auth}
						handle={handle}
						authUser={authUser}
					/>
				</ScrollView>
			</View>
		)
	);
}
