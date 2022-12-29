import { useState, useEffect } from "react";
import { Text, View } from "react-native";

import {
	Input,
	Button,
	Avatar,
} from "@rneui/themed";

import { useNavigation, useRoute } from "@react-navigation/native";

import { formatRelative, parseISO } from "date-fns";
import Toast from "react-native-root-toast";

import { fetchTweet, postShare } from "../../apiCalls";

export default function Share({ authUser }) {
	const route = useRoute();
	const navigation = useNavigation();

	const [body, setBody] = useState("");
	const [tweet, setTweet] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	const { id } = route.params;

	useEffect(() => {
		(async () => {
			let tweet = await fetchTweet(id);
			// handle error

			setTweet(tweet);
			setIsLoading(false);
		})();
	}, [id]);

	return (
		!isLoading &&
		<View style={{ padding: 20 }}>
			<View
				style={{
					flex: 1,
					marginVertical: 20,
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
						let result = await postShare(id, body);
						// handle error

						Toast.show("You shared a post", {
							duration: Toast.durations.LONG,
						});

						navigation.navigate("Latest");
					})();
				}}>
					Share
				</Button>
			</View>

			<View>
				<Input
					multiline={true}
					placeholder="Your reply"
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

			<View style={{ margin: 10, borderWidth: 1, borderColor: "#ddd" }}>
				<View
					style={{
						backgroundColor: "#f5f5f5",
						padding: 15,
						borderRadius: 4
					}}
				>
					<View style={{ flex: 1, flexDirection: "row" }}>
						<Avatar
							rounded
							title="O"
							size={32}
							containerStyle={{ backgroundColor: "grey" }}
						/>
						<View style={{ marginLeft: 10, flexShrink: 1 }}>
							<View style={{ marginTop: 5 }}>
								<View
									style={{
										flex: 1,
										flexDirection: "row",
										flexWrap: "wrap"
									}}
								>
									<Text
										style={{
											fontSize: 12,
											fontWeight: "bold",
											marginRight: 6
										}}
									>
										{tweet.user[0].name}
									</Text>

									<Text
										style={{
											fontSize: 12,
											color: "grey",
											marginRight: 10
										}}
									>
										@{tweet.user[0].handle}
									</Text>

									<Text
										style={{
											fontSize: 12,
											color: "#5ad"
										}}
									>
										{
											formatRelative(
												parseISO(tweet.created), new Date()
											)
										}
									</Text>
								</View>
							</View>

							<View style={{ marginTop: 5 }}>
								<Text style={{ fontSize: 12 }}>
									{tweet.body}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}
