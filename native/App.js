import "react-native-gesture-handler";

import { useState, useEffect } from "react";

import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
	Button,
	ListItem,
	BottomSheet,
} from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";

import Tweet from "./Tweet";
import Login from "./Login";
import Notis from "./Notis";
import Latest from "./Latest";
import Search from "./Search";
import Singup from "./Singup";
import Profile from "./Profile";

import { fetchUser, fetchNotis } from "./apiCalls";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Logo() {
	return (
		<Ionicons name="planet" size={36} color="#1c9cea" />
	)
}

function Home({ setShowMenu, authUser, auth }) {
	return (
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
		</Stack.Navigator>
	);
}

export default function App() {
	const [auth, setAuth] = useState(false);
	const [authUser, setAuthUser] = useState({});
	const [showMenu, setShowMenu] = useState(false);
	const [notiCount, setNotiCount] = useState(0);

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
										<Profile setAuth={setAuth} setAuthUser={setAuthUser} />
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
								{ () => <Notis setNotiCount={setNotiCount} /> }
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
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
