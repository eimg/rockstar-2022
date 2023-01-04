import { ScrollView, View, TouchableOpacity } from "react-native";
import { Avatar, Button, Text, useTheme } from "@rneui/themed";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Logo from "../_Share/Logo";
import EditProfile from "./EditProfile";
import UserContents from "../_Share/UserContents";
import ModeSwitcher from "../_Share/ModeSwitcher";

const Stack = createNativeStackNavigator();

export default function ProfileStack({
	auth,
	setAuth,
	authUser,
	setAuthUser,
	mode,
	setMode,
}) {
	return (
		<>
			<Stack.Navigator
				screenOptions={{
					headerTitle: () => <Logo />,
					headerTitleAlign: "center",
					headerRight: () => (
						<ModeSwitcher mode={mode} setMode={setMode} />
					),
				}}>
				<Stack.Screen name="MainProfile">
					{() => (
						<Profile
							auth={auth}
							setAuth={setAuth}
							authUser={authUser}
							setAuthUser={setAuthUser}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen name="EditProfile">
					{() => (
						<EditProfile
							authUser={authUser}
							setAuthUser={setAuthUser}
						/>
					)}
				</Stack.Screen>
			</Stack.Navigator>
		</>
	);
}

function Profile({ auth, setAuth, authUser, setAuthUser }) {
	const navigation = useNavigation();
	const { theme } = useTheme();

	return (
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
							size={98}
							rounded
							title={authUser.name[0].toUpperCase()}
							containerStyle={{
								backgroundColor: theme.colors.success,
							}}
						/>
						<View style={{ marginTop: 10, marginLeft: 10 }}>
							<Text style={{ fontWeight: "bold", fontSize: 20 }}>
								{authUser.name}
								<Text style={{ marginLeft: 6, color: "grey" }}>
									@{authUser.handle}
								</Text>
							</Text>

							<Text style={{ marginTop: 10 }}>
								{authUser.profile}
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
										handle: authUser.handle,
									});
								}}>
								<Text
									style={{
										fontSize: 16,
										color: theme.colors.primary,
									}}>
									{authUser.following.length} Followings
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate("Followers", {
										handle: authUser.handle,
									});
								}}>
								<Text
									style={{
										marginLeft: 10,
										fontSize: 16,
										color: theme.colors.primary,
									}}>
									{authUser.followers.length} Followers
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View
						style={{
							marginTop: 10,
						}}>
						<Button
							type="outline"
							style={{ marginRight: 10 }}
							onPress={() => {
								navigation.navigate("EditProfile");
							}}>
							Edit Profile
						</Button>
						<View style={{ marginTop: 10 }}>
							<Button
								color={theme.colors.error}
								onPress={() => {
									(async () => {
										AsyncStorage.removeItem("token");
									})();

									setAuth(false);
									setAuthUser({});
								}}>
								Logout
							</Button>
						</View>
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
