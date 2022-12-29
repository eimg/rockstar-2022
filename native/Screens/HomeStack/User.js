import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import {
	Avatar,
	Button,
} from "@rneui/themed";

import { useRoute } from "@react-navigation/native";

import { fetchUserByHandle } from "../../apiCalls";
import UserContents from "../_Share/UserContents";

export default function User({ authUser, auth }) {
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
		!isLoading &&
		<View style={{ flex: 1, alignItems: "stretch", justifyContent: "center" }}>
			<ScrollView>
				<View style={{ backgroundColor: "#5af", height: 100 }}>
				</View>

				<View 
					style={{ 
						flexDirection: "row", 
						justifyContent: "space-between", 
						marginHorizontal: 20, 
						marginBottom: 20,
					}}
				>
					<View style={{ marginTop: -50 }}>
						<Avatar
							rounded
							size={98}
							title={user.name[0].toUpperCase()}
							containerStyle={{ backgroundColor: "#0a5" }}
						/>
						<View style={{ marginTop: 10, marginLeft: 10 }}>
							<Text style={{ fontWeight: "bold", fontSize: 20 }}>
								{user.name}
								<Text style={{ marginLeft: 6, color: "grey" }}>
									@{user.handle}
								</Text>
							</Text>

							<Text style={{ marginTop: 10 }}>{user.profile}</Text>
						</View>
						<View style={{ marginLeft: 10, marginTop: 15 }}>
							<Text style={{ fontSize: 16, color: "#09c" }}>
								{user.following_users.length} Followings

								<Text style={{ marginLeft: 10 }}>
									{user.followers_users.length} Followers
								</Text>
							</Text>
						</View>
					</View>

					{auth &&
						<Button
							style={{
								marginTop: 20,
							}}
							onPress={() => {
								//
							}}>
							Follow
						</Button>
					}
				</View>

				<UserContents 
					auth={auth}
					handle={handle} 
					authUser={authUser} 
				/>
			</ScrollView>
		</View>
	);
}