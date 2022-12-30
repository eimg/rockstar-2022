import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from "@rneui/themed";

import { useNavigation } from "@react-navigation/native";
import { formatRelative, parseISO } from "date-fns";

export default function Attachment({ tweet }) {
	const navigation = useNavigation();

	return (
		<>
			{(
				tweet.origin_tweet[0] &&

				<View
					style={{
						padding: 15,
						marginTop: 15,
						borderRadius: 4,
						backgroundColor: "#f5f5f5",
					}}
				>
					<View style={{ flex: 1, flexDirection: "row" }}>
						<TouchableOpacity onPress={() => {
							navigation.navigate("User", {
								handle:
									tweet.origin_tweet[0].user[0].handle
							});
						}}>
							<Avatar
								rounded
								title={
									tweet.origin_tweet[0]
										.user[0].name[0].toUpperCase()
								}
								size={32}
								containerStyle={{ backgroundColor: "grey" }}
							/>
						</TouchableOpacity>
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
										{tweet.origin_tweet[0].user[0].name}
									</Text>

									<Text
										style={{
											fontSize: 12,
											color: "grey",
											marginRight: 10
										}}
									>
										@{tweet.origin_tweet[0].user[0].handle}
									</Text>

									<Text
										style={{
											fontSize: 12,
											color: "#5ad"
										}}
									>
										{
											formatRelative(
												parseISO(tweet.origin_tweet[0].created), new Date()
											)
										}
									</Text>
								</View>
							</View>

							<TouchableOpacity
								onPress={() => {
									navigation.navigate("Tweet", {
										_id: tweet.origin_tweet[0]._id
									});
								}}
							>
								<View style={{ marginTop: 5 }}>
									<Text style={{ fontSize: 12 }}>
										{tweet.origin_tweet[0].body}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)}

			{
				(tweet.origin && !tweet.origin_tweet[0]) &&
				<View
					style={{
						padding: 15,
						marginTop: 15,
						backgroundColor: "#f5f5f5"
					}}
				>
					<Text style={{ color: "grey" }}>
						[ deleted post ]
					</Text>
				</View>
			}
		</>
	)
}
