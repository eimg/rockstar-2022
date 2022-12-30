import { View, Text } from "react-native";
import { Button } from "@rneui/themed";

import { useNavigation } from "@react-navigation/native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-root-toast";

export default function ActionButtons({ auth, authUser, tweet, toggleLike }) {
	const navigation = useNavigation();

	return (
		<View
			style={{
				marginTop: 10,
				flexDirection: "row",
				justifyContent: "space-around",
			}}
		>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Button type="clear" onPress={() => {
					if (auth) toggleLike(tweet._id);
					else Toast.show("Login required to like", {
						duration: Toast.durations.LONG,
					});
				}}>
					{
						tweet.likes &&
							tweet.likes.includes(authUser._id)
							? <Ionicons name="heart" size={24} color="red" />
							: <Ionicons name="heart-outline" size={24} color="red" />
					}
				</Button>
				<Button type="clear" onPress={() => {
					navigation.navigate("Likes", { id: tweet._id });
				}}>
					<Text style={{ marginLeft: 5 }}>
						{tweet.likes && tweet.likes.length}
					</Text>
				</Button>
			</View>

			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Button type="clear" onPress={() => {
					if (auth) navigation.navigate("Share", { id: tweet._id });
					else Toast.show("Login required to share", {
						duration: Toast.durations.LONG,
					});
				}}>
					<Ionicons name="share-social-outline" size={24} color="#09a" />
				</Button>
				<Button type="clear" onPress={() => {
					navigation.navigate("Shares", { id: tweet._id });
				}}>
					<Text style={{ marginLeft: 5 }}>
						{tweet.shares.length}
					</Text>
				</Button>
			</View>

			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Button type="clear" onPress={() => {
					navigation.navigate("Tweet", { _id: tweet._id });
				}}>
					<Ionicons name="chatbubble-outline" size={24} color="green" />
				</Button>
				<Button type="clear" onPress={() => {
					navigation.navigate("Tweet", { _id: tweet._id });
				}}>
					<Text style={{ marginLeft: 5 }}>
						{tweet.comments.length}
					</Text>
				</Button>
			</View>
		</View>
	)
}