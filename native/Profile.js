import { Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '@rneui/themed';

export default function Profile({ setAuth, setAuthUser }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Profile</Text>
			<Button onPress={() => {
				(async () => {
					AsyncStorage.removeItem("token");
				})();

				setAuth(false);
				setAuthUser({});
			}}>Logout</Button>
		</View>
	);
}