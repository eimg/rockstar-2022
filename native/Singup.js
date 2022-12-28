import { useState } from "react";

import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
	Input,
	Button,
} from '@rneui/themed';

import { register } from './apiCalls';

export default function Singup({ setAuth, setAuthUser }) {
	const [name, setName] = useState("");
	const [handle, setHandle] = useState("");
	const [profile, setProfile] = useState("");
	const [password, setPassword] = useState("");
	const [hasError, setHasError] = useState(false);
	const [errMsg, setErrMsg] = useState(false);

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
				Register
			</Text>

			{
				hasError && <View 
					style={{ 
						padding: 15, 
						backgroundColor: '#fdd', 
						marginBottom: 10 
					}}>
						<Text>{errMsg}</Text>
					</View>
			}

			<Input placeholder="Name" onChangeText={setName} value={name} />
			<Input 
				placeholder="Handle" 
				onChangeText={setHandle} 
				value={handle} 
				leftIcon={
					<Ionicons name="at" size={24} color="grey" />
				}
			/>
			<Input placeholder="Profile" onChangeText={setProfile} value={profile} />
			<Input 
				placeholder="Password" 
				onChangeText={setPassword} 
				value={password} 
				secureTextEntry={true} 
			/>

			<Button onPress={() => {
				setHasError(false);

				(async () => {
					let result = await register(name, handle, profile, password);

					if (!result) {
						setErrMsg("required: name, handle, profile");
						setHasError(true);
						return;
					}

					if (result === 409) {
						setErrMsg("Handle already taken");
						setHasError(true);
						return;
					}

					setAuth(true);
					setAuthUser(result.user)
				})();
			}}>Register</Button>
		</View>
	);
}
