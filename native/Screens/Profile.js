import { ScrollView, Text, View, TouchableOpacity } from "react-native";

import {
	Avatar,
	Button
} from "@rneui/themed";

import AsyncStorage from "@react-native-async-storage/async-storage";

import UserContents from "./_Share/UserContents";
import { useNavigation } from "@react-navigation/native";

export default function Profile({ auth, setAuth, authUser, setAuthUser }) {
	const navigation = useNavigation();

	return (
		<View style={{ flex: 1, alignItems: "stretch", justifyContent: "center" }}>
			<ScrollView>
				<View style={{ backgroundColor: "#5af", height: 100 }}></View>

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
							size={98}
							rounded
							title={authUser.name[0].toUpperCase()}
							containerStyle={{ backgroundColor: "#0a5" }}
						/>
						<View style={{ marginTop: 10, marginLeft: 10 }}>
							<Text style={{ fontWeight: "bold", fontSize: 20 }}>
								{authUser.name}
								<Text style={{ marginLeft: 6, color: "grey" }}>
									@{authUser.handle}
								</Text>
							</Text>

							<Text style={{ marginTop: 10 }}>{authUser.profile}</Text>
						</View>
						<View style={{ marginLeft: 10, marginTop: 15, flexDirection: "row" }}>
							<TouchableOpacity onPress={() => {
								navigation.navigate("Following", { handle: authUser.handle });
							}}>
								<Text style={{ fontSize: 16, color: "#09c" }}>
									{authUser.following.length} Followings
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {
								navigation.navigate("Followers", { handle: authUser.handle });
							}}>
								<Text style={{ marginLeft: 10, fontSize: 16, color: "#09c" }}>
									{authUser.followers.length} Followers
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{
						marginTop: 10,
					}}>
						<Button
							onPress={() => {
								(async () => {
									AsyncStorage.removeItem("token");
								})();

								setAuth(false);
								setAuthUser({});
							}}>Logout</Button>
					</View>
				</View>

				<UserContents
					auth={auth}
					authUser={authUser}
					handle={authUser.handle}
				/>
			</ScrollView>
		</View>
	);
}