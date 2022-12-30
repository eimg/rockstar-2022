import { useState } from "react";
import { View } from "react-native";

import {
	Text,
	Input,
	Button,
	useTheme,
} from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";

import { login } from "../apiCalls";

export default function Login({ setAuth, setAuthUser }) {
	const [handle, setHandle] = useState("");
	const [password, setPassword] = useState("");
	const [hasError, setHasError] = useState(false);

	const { theme } = useTheme();

	return (
		<View
			style={{
				flex: 1,
				alignItems: "stretch",
				justifyContent: "flex-start",
				padding: 20,
			}}
		>
			<Text
				style={{
					fontSize: 24,
					fontWeight: "bold",
					marginBottom: 20,
					marginLeft: 10,
				}}
			>
				Login
			</Text>

			{
				hasError && <View
					style={{
						padding: 15,
						backgroundColor: theme.colors.warning,
						marginBottom: 10,
					}}
				>
					<Text>Handle or password incorrect</Text>
				</View>
			}

			<Input
				value={handle}
				placeholder="Handle"
				onChangeText={setHandle}
				leftIcon={
					<Ionicons name="at" size={24} color="grey" />
				}
			/>
			<Input
				placeholder="Password"
				onChangeText={setPassword}
				secureTextEntry={true}
				value={password}
			/>
			<Button
				onPress={() => {
					setHasError(false);

					(async () => {
						let result = await login(handle, password);
						if (!result) return setHasError(true);

						setAuth(true);
						setAuthUser(result.user);
					})();
				}}
			>
				Login
			</Button>
		</View>
	);
}
