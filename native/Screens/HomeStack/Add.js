import { useState } from "react";
import { View } from "react-native";

import {
	Input,
	Button,
	Avatar,
} from "@rneui/themed";

import { useNavigation } from "@react-navigation/native";

import Toast from "react-native-root-toast";

import { postTweet } from "../../apiCalls";

export default function Add({ authUser }) {
	const navigation = useNavigation();
	const [body, setBody] = useState("");

	return (
		<View style={{ padding: 10 }}>
			<View
				style={{
					marginVertical: 10,
					marginHorizontal: 10,
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<Avatar
					rounded
					size={48}
					title={authUser.name[0].toUpperCase()}
					containerStyle={{ backgroundColor: "#0a5" }}
				/>
				<Button onPress={() => {
					if (!body) return;

					(async () => {
						let result = await postTweet(body);
						// handle api error here

						Toast.show("You tweet is posted", {
							duration: Toast.durations.LONG,
						});

						navigation.navigate("Latest");
					})();
				}}>Tweet</Button>
			</View>

			<View>
				<Input
					multiline={true}
					placeholder="What's on your mind"
					onChangeText={setBody}
					value={body}
					style={{
						height: 100,
						padding: 10,
						borderWidth: 1,
						borderColor: "grey",
						backgroundColor: "white",
					}}
				/>
			</View>
		</View>
	);
}
