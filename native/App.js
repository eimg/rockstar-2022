import "react-native-gesture-handler";

import { View } from "react-native";
import { useState, useEffect } from "react";

import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

import {
	FAB,
	Button,
	ListItem,
	BottomSheet,
} from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";

import Login from "./Screens/Login";
import Notis from "./Screens/Notis";
import Search from "./Screens/Search";
import Singup from "./Screens/Singup";
import Profile from "./Screens/Profile";
import Add from "./Screens/HomeStack/Add";
import User from "./Screens/HomeStack/User";
import Share from "./Screens/HomeStack/Share";
import Tweet from "./Screens/HomeStack/Tweet";
import Latest from "./Screens/HomeStack/Latest";
import Followers from "./Screens/HomeStack/Followers";
import Following from "./Screens/HomeStack/Following";

import { fetchUser, fetchNotis } from "./apiCalls";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Logo() {
	return (
		<Ionicons name="planet" size={36} color="#1c9cea" />
	)
}

function Home({ setShowMenu, authUser, setAuthUser, auth }) {
	const navigation = useNavigation();

	return (
		<>
			<Stack.Navigator screenOptions={{
				headerTitle: () => <Logo />,
				headerTitleAlign: "center",
				headerRight: () => (
					<View>
						<Button type="clear" onPress={() => {
							setShowMenu(true);
						}}>
							<Ionicons name="ellipsis-vertical-sharp" size={24} />
						</Button>
					</View>
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
					{() => <User authUser={authUser} auth={auth} setAuthUser={setAuthUser} />}
				</Stack.Screen>
				<Stack.Screen name="Followers">
					{() => <Followers setAuthUser={setAuthUser} authUser={authUser} auth={auth} />}
				</Stack.Screen>
				<Stack.Screen name="Following">
					{() => <Following setAuthUser={setAuthUser} authUser={authUser} auth={auth} />}
				</Stack.Screen>
			</Stack.Navigator>

			{auth &&
				<FAB
					visible={true}
					icon={() => <Ionicons name="add" style={{ color: "white" }} size={24} />}
					color="#1c9cea"
					style={{
						position: "absolute",
						right: 30,
						bottom: 30,
					}}
					onPress={() => {
						navigation.navigate("Add");
					}}
				/>
			}
		</>
	);
}

export default function App() {
	const [auth, setAuth] = useState(false);
	const [authUser, setAuthUser] = useState({});
	const [notiCount, setNotiCount] = useState(0);
	const [showMenu, setShowMenu] = useState(false);

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
			<NavigationContainer>
				<RootSiblingParent>
					<Tab.Navigator screenOptions={{
						headerTitle: () => <Logo />,
						headerTitleAlign: "center",
						headerRight: () => (
							<View style={{ marginRight: 20 }}>
								<Button type="clear" onPress={() => {
									setShowMenu(true);
								}}>
									<Ionicons name="ellipsis-vertical-sharp" size={24} />
								</Button>
							</View>
						),
					}}>
						<Tab.Screen
							name="Home"
							options={{
								tabBarIcon: ({ color }) => (
									<Ionicons name="home-outline" size={24} color={color} />
								),
								headerShown: false,
							}}
						>
							{
								() => (
									<Home
										auth={auth}
										authUser={authUser}
										setAuthUser={setAuthUser}
										setShowMenu={setShowMenu}
									/>
								)
							}
						</Tab.Screen>

						<Tab.Screen
							name="Search"
							component={Search}
							options={{
								tabBarIcon: ({ color }) => (
									<Ionicons name="search" size={24} color={color} />
								)
							}}
						/>

						{auth
							? <>
								<Tab.Screen
									name="Profile"
									options={{
										tabBarIcon: ({ color }) => (
											<Ionicons
												size={24}
												color={color}
												name="person-circle-outline"
											/>
										)
									}}
								>
									{
										() => (
											<Profile
												auth={auth}
												setAuth={setAuth}
												authUser={authUser}
												setAuthUser={setAuthUser}
											/>
										)
									}
								</Tab.Screen>

								<Tab.Screen
									name="Notis"
									options={{
										tabBarBadge: notiCount < 1
											? null : notiCount > 9
												? ".." : notiCount,
										tabBarIcon: ({ color }) => (
											<Ionicons name="notifications" size={24} color={color} />
										),
									}}
								>
									{() => <Notis setNotiCount={setNotiCount} />}
								</Tab.Screen>
							</>

							: <>
								<Tab.Screen
									name="Singup"
									options={{
										tabBarIcon: ({ color }) => (
											<Ionicons
												size={24}
												color={color}
												name="person-add-outline"
											/>
										)
									}}
								>
									{
										() => (
											<Singup setAuth={setAuth} setAuthUser={setAuthUser} />
										)
									}
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
										)
									}}
								>
									{
										() => (
											<Login setAuth={setAuth} setAuthUser={setAuthUser} />
										)
									}
								</Tab.Screen>
							</>
						}
					</Tab.Navigator>

					<BottomSheet modalProps={{}} isVisible={showMenu}>
						<ListItem>
							<Ionicons name="settings" size={24} color="#aaa" />
							<ListItem.Content>
								<ListItem.Title style={{ color: "#aaa" }}>
									Settings
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem onPress={() => {
							setShowMenu(false);
						}}>
							<Ionicons
								size={24}
								color="red"
								name="close-circle-outline"
							/>
							<ListItem.Content>
								<ListItem.Title>
									Close
								</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					</BottomSheet>
				</RootSiblingParent>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
