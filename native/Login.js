import { useState } from "react";

import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
	Input,
	Button,
} from '@rneui/themed';

import { login } from './apiCalls';

export default function Login({ setAuth, setAuthUser }) {
	let [ handle, setHandle ] = useState("");
	let [ password, setPassword ] = useState("");
	let [ hasError, setHasError ] = useState(false);

	return (
		<View 
			style={{ 
				flex: 1, 
				alignItems: 'stretch', 
				justifyContent: 'flex-start', 
				padding: 20 
			}}
		>
			<Text 
				style={{ 
					fontSize: 24, 
					fontWeight: 'bold', 
					marginBottom: 20, 
					marginLeft: 10 
				}}
			>
				Login
			</Text>

			{
				hasError && <View 
					style={{ 
						padding: 15, 
						backgroundColor: '#fdd', 
						marginBottom: 10 
					}}
				>
					<Text>Handle or password incorrect</Text>
				</View>
			}

			<Input 
				placeholder="Handle" 
				value={handle} 
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
