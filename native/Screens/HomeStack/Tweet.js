import { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";

import {
	Card,
	Avatar,
	Button,
	Input,
} from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useNavigation, useRoute } from "@react-navigation/native";
import { formatRelative, parseISO } from "date-fns";

import Toast from "react-native-root-toast";

import { fetchTweet, putLike, postNoti, postReply } from "../../apiCalls";
import ActionButtons from "../_Share/ActionButtons";
import Attachment from "../_Share/Attachment";

export default function Tweet({ authUser, auth }) {
	const route = useRoute();
	const navigation = useNavigation();

	const { _id } = route.params;

	const [body, setBody] = useState("");
	const [tweet, setTweet] = useState({});
	const [isLoading, setIsLoading] = useState(true);


	useEffect(() => {
		(async () => {
			let result = await fetchTweet(_id);
			// handle api error here

			setTweet(result);
			setIsLoading(false);
		})();
	}, [isLoading]);

	const toggleLike = id => {
		if (!auth) return false;

		(async () => {
			let likes = await putLike(id);
			// handle api error here

			let updatedTweet = await fetchTweet(id);
			// handle api error here

			setTweet(updatedTweet);
			postNoti("like", id);
		})();
	}

	const toggleLikeForComment = (commentId, tweetId) => {
		if (!auth) return false;

		(async () => {
			let likes = await putLike(commentId);
			// handle api error here

			let updatedTweet = await fetchTweet(tweetId);
			// handle api error here

			setTweet(updatedTweet);
		})();
	}

	return (
		<ScrollView>
			{!isLoading &&
				<View key={tweet._id}>
					<Card>
						<View>
							<View style={{ flexDirection: "row" }}>
								<TouchableOpacity onPress={() => {
									navigation.navigate("User", { handle: tweet.user[0].handle });
								}}>
									<Avatar
										size={48}
										rounded
										title="T"
										containerStyle={{ backgroundColor: "#0a5" }}
									/>
								</TouchableOpacity>
								<View style={{ marginLeft: 10, marginTop: 5, flexShrink: 1 }}>
									<View
										style={{
											flexDirection: "row",
											marginBottom: 5,
											flexWrap: "wrap"
										}}
									>
										<Text
											style={{
												fontSize: 16,
												fontWeight: "bold",
												marginRight: 6
											}}
										>
											{tweet.user[0].name}
										</Text>

										<Text style={{ fontSize: 16, color: "#5ad" }}>
											{
												formatRelative(
													parseISO(tweet.created), new Date()
												)
											}
										</Text>
									</View>

									<Text
										style={{
											fontSize: 16,
											color: "grey",
											marginRight: 10
										}}
									>
										@{tweet.user[0].handle}
									</Text>
								</View>
							</View>

							<View style={{ marginTop: 20 }}>
								<View>
									<Text style={{ fontSize: 20 }}>{tweet.body}</Text>
								</View>

								<Attachment tweet={tweet} />
							</View>
						</View>

						<View
							style={{
								flexDirection: "row",
								marginTop: 10,
								justifyContent: "space-around"
							}}
						>

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
								<Text style={{ marginLeft: 5 }}>
									{tweet.likes && tweet.likes.length}
								</Text>
							</Button>

							<Button type="clear" onPress={() => {
								if (auth) navigation.navigate("Share", { id: tweet._id });
								else Toast.show("Login required to share", {
									duration: Toast.durations.LONG,
								});
							}}>
								<Ionicons name="share-social-outline" size={24} color="#09a" />
								<Text style={{ marginLeft: 5 }}>
									{tweet.shares.length}
								</Text>
							</Button>
							<Button type="clear" onPress={() => {
								navigation.navigate("Tweet", { _id: tweet._id });
							}}>
								<Ionicons name="chatbubble-outline" size={24} color="green" />
								<Text style={{ marginLeft: 5 }}>
									{tweet.comments.length}
								</Text>
							</Button>
						</View>
					</Card>

					{tweet.comments.map(comment => {
						return (
							<Card key={comment._id}>
								<View style={{ flex: 1, flexDirection: "row" }}>
									<Avatar
										rounded
										size={32}
										title={comment.user[0].name[0].toUpperCase()}
										containerStyle={{ backgroundColor: "grey" }}
									/>
									<View style={{ marginLeft: 20, flexShrink: 1 }}>
										<View style={{ marginTop: 10 }}>
											<View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
												<Text
													style={{
														fontSize: 14,
														marginRight: 6,
														fontWeight: "bold",
													}}
												>
													{comment.user[0].name}
												</Text>

												<Text
													style={{
														fontSize: 14,
														color: "grey",
														marginRight: 10
													}}
												>
													@{comment.user[0].handle}
												</Text>

												<Text style={{ fontSize: 14, color: "#5ad" }}>
													{
														formatRelative(
															parseISO(comment.created), new Date()
														)
													}
												</Text>
											</View>
										</View>

										<TouchableOpacity onPress={() => {
											navigation.replace("Tweet", { _id: comment._id });
										}}>
											<View style={{ marginTop: 10 }}>
												<Text style={{ fontSize: 14 }}>{comment.body}</Text>
											</View>
										</TouchableOpacity>
									</View>
								</View>

								<ActionButtons
									auth={auth}
									authUser={authUser}
									tweet={tweet}
									toggleLike={toggleLike}
								/>
							</Card>
						)
					})}

					{auth &&
						<View style={{ margin: 20 }}>
							<Input
								value={body}
								multiline={true}
								onChangeText={setBody}
								style={{ height: 80 }}
								placeholder="Your reply"
							/>
							<Button onPress={() => {
								if (!body) return;

								(async () => {
									let result = await postReply(tweet._id, body);
									// handle api error here

									let update = await fetchTweet(_id);
									// handle api error here

									setTweet(update);

									Toast.show("You reply is posted", {
										duration: Toast.durations.LONG,
									});

									setBody("");
								})();
							}}>Reply</Button>
						</View>
					}
				</View>
			}
		</ScrollView>
	);
}
