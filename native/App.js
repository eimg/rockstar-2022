import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";

import { useState, useEffect } from "react";

import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createTheme, ThemeProvider, useTheme } from "@rneui/themed";

import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

import { FAB } from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";

import Login from "./Screens/Login";
import Notis from "./Screens/Notis";
import Search from "./Screens/Search";
import Singup from "./Screens/Singup";
import Logo from "./Screens/_Share/Logo";
import Add from "./Screens/HomeStack/Add";
import User from "./Screens/HomeStack/User";
import Share from "./Screens/HomeStack/Share";
import Tweet from "./Screens/HomeStack/Tweet";
import Likes from "./Screens/HomeStack/Likes";
import Latest from "./Screens/HomeStack/Latest";
import Shares from "./Screens/HomeStack/Shares";
import Followers from "./Screens/HomeStack/Followers";
import Following from "./Screens/HomeStack/Following";
import ModeSwitcher from "./Screens/_Share/ModeSwitcher";
import ProfileStack from "./Screens/ProfileStack/Profile";

import { fetchUser, fetchNotis } from "./apiCalls";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Home({ authUser, setAuthUser, auth, mode, setMode }) {
	const navigation = useNavigation();

	const { theme } = useTheme();

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
				<Stack.Screen name="Latest">
					{() => <Latest authUser={authUser} auth={auth} />}
				</Stack.Screen>
				<Stack.Screen name="Tweet">
					{() => <Tweet authUser={authUser} auth={auth} />}
				</Stack.Screen>
				<Stack.Screen name="Add">
					{() => <Add authUser={authUser} auth={auth} />}
				</Stack.Screen>
				<Stack.Screen name="Share">
					{() => <Share authUser={authUser} auth={auth} />}
				</Stack.Screen>
				<Stack.Screen name="User">
					{() => (
						<User
							authUser={authUser}
							auth={auth}
							setAuthUser={setAuthUser}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen name="Followers">
					{() => (
						<Followers
							setAuthUser={setAuthUser}
							authUser={authUser}
							auth={auth}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen name="Following">
					{() => (
						<Following
							setAuthUser={setAuthUser}
							authUser={authUser}
							auth={auth}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen name="Likes">
					{() => (
						<Likes
							setAuthUser={setAuthUser}
							authUser={authUser}
							auth={auth}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen name="Shares">
					{() => (
						<Shares
							setAuthUser={setAuthUser}
							authUser={authUser}
							auth={auth}
						/>
					)}
				</Stack.Screen>
			</Stack.Navigator>

			{auth && (
				<FAB
					visible={true}
					icon={() => (
						<Ionicons
							name="add"
							style={{ color: "white" }}
							size={24}
						/>
					)}
					color={theme.colors.primary}
					style={{
						position: "absolute",
						right: 30,
						bottom: 30,
					}}
					onPress={() => {
						navigation.navigate("Add");
					}}
				/>
			)}
		</>
	);
}

export default function App() {
	const [auth, setAuth] = useState(false);
	const [authUser, setAuthUser] = useState({});
	const [notiCount, setNotiCount] = useState(0);
	const [mode, setMode] = useState("dark");

	const theme = createTheme({
		mode,
		components: {
			Input: {
				inputStyle: {
					outline: "none",
					margin: 0,
					padding: 10,
				},
			},
			Button: {
				buttonStyle: {
					borderRadius: 20,
				},
			},
		},
		darkColors: {
			primary: "#0a84ff",
			lightBlue: "#5ad",
			fade: "#222",
		},
		lightColors: {
			primary: "#0a84ff",
			lightBlue: "#5ad",
			fade: "#efefef",
		},
	});

	useEffect(() => {
		(async () => {
			let notis = await fetchNotis();
			if (!notis) return false;

			setNotiCount(notis.filter(noti => !noti.read).length);
		})();
	}, [notiCount]);

	useEffect(() => {
		(async () => {
			let user = await fetchUser();
			if (!user) return false;

			setAuthUser(user);
			setAuth(true);
		})();
	}, [auth]);

	return (
		<SafeAreaProvider>
			<ThemeProvider theme={theme}>
				<NavigationContainer
					theme={mode === "dark" ? DarkTheme : DefaultTheme}>
					<RootSiblingParent>
						<Tab.Navigator
							screenOptions={{
								headerTitle: () => <Logo />,
								headerTitleAlign: "center",
								headerRight: () => (
									<ModeSwitcher
										mode={mode}
										setMode={setMode}
									/>
								),
							}}>
							<Tab.Screen
								name="Home"
								options={{
									tabBarIcon: ({ color }) => (
										<Ionicons
											name="home-outline"
											size={24}
											color={color}
										/>
									),
									headerShown: false,
								}}>
								{() => (
									<Home
										auth={auth}
										authUser={authUser}
										setAuthUser={setAuthUser}
										mode={mode}
										setMode={setMode}
									/>
								)}
							</Tab.Screen>

							<Tab.Screen
								name="Search"
								options={{
									tabBarIcon: ({ color }) => (
										<Ionicons
											name="search"
											size={24}
											color={color}
										/>
									),
								}}>
								{() => (
									<Search
										authUser={authUser}
										setAuthUser={setAuthUser}
									/>
								)}
							</Tab.Screen>

							{auth ? (
								<>
									<Tab.Screen
										name="Profile"
										options={{
											headerShown: false,
											tabBarIcon: ({ color }) => (
												<Ionicons
													size={24}
													color={color}
													name="person-circle-outline"
												/>
											),
										}}>
										{() => (
											<ProfileStack
												auth={auth}
												setAuth={setAuth}
												authUser={authUser}
												setAuthUser={setAuthUser}
												mode={mode}
												setMode={setMode}
											/>
										)}
									</Tab.Screen>

									<Tab.Screen
										name="Notis"
										options={{
											tabBarBadge:
												notiCount < 1
													? null
													: notiCount > 9
													? ".."
													: notiCount,
											tabBarIcon: ({ color }) => (
												<Ionicons
													name="notifications"
													size={24}
													color={color}
												/>
											),
										}}>
										{() => (
											<Notis
												setNotiCount={setNotiCount}
											/>
										)}
									</Tab.Screen>
								</>
							) : (
								<>
									<Tab.Screen
										name="Singup"
										options={{
											tabBarIcon: ({ color }) => (
												<Ionicons
													size={24}
													color={color}
													name="person-add-outline"
												/>
											),
										}}>
										{() => (
											<Singup
												setAuth={setAuth}
												setAuthUser={setAuthUser}
											/>
										)}
									</Tab.Screen>

									<Tab.Screen
										name="Login"
										options={{
											tabBarIcon: ({ color }) => (
												<Ionicons
													size={24}
													color={color}
													name="log-in-outline"
												/>
											),
										}}>
										{() => (
											<Login
												setAuth={setAuth}
												setAuthUser={setAuthUser}
											/>
										)}
									</Tab.Screen>
								</>
							)}
						</Tab.Navigator>
					</RootSiblingParent>
				</NavigationContainer>

				<StatusBar style={mode === "dark" ? "light" : "dark"} />
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
