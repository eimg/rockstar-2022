import { useState } from 'react';
import { Text, View } from 'react-native';

import { Input, Button } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import { updateProfile } from '../../apiCalls';

export default function EditProfile({ authUser, setAuthUser }) {
	const navigation = useNavigation();

	const [name, setName] = useState(authUser.name);
	const [profile, setProfile] = useState(authUser.profile);
	const [password, setPassword] = useState('');

	const [errMsg, setErrMsg] = useState(false);
	const [hasError, setHasError] = useState(false);

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'stretch',
				justifyContent: 'flex-start',
				padding: 20,
			}}>
			<Text
				style={{
					fontSize: 24,
					fontWeight: 'bold',
					marginBottom: 20,
					marginLeft: 10,
				}}>
				Profile
			</Text>

			{hasError && (
				<View
					style={{
						padding: 15,
						backgroundColor: '#fdd',
						marginBottom: 10,
					}}>
					<Text>{errMsg}</Text>
				</View>
			)}

			<Input
				label='Name'
				placeholder='Name'
				onChangeText={setName}
				value={name}
			/>
			<Input
				label='Handle'
				disabled
				placeholder='Handle'
				value={authUser.handle}
				leftIcon={<Ionicons name='at' size={24} color='grey' />}
			/>
			<Input
				label='Profile'
				placeholder='Profile'
				onChangeText={setProfile}
				value={profile}
			/>
			<Input
				label='Password'
				placeholder='Leave blank to unchange'
				onChangeText={setPassword}
				value={password}
				secureTextEntry={true}
			/>

			<Button
				onPress={() => {
					setHasError(false);

					(async () => {
						let result = await updateProfile(
							authUser._id,
							name,
							profile,
							password,
						);
						// handle api error here

						if (!result) {
							setErrMsg('required: name');
							setHasError(true);
							return;
						}

						setAuthUser(result);
						navigation.goBack();
					})();
				}}>
				Update
			</Button>
		</View>
	);
}
