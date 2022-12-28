import {
	Card,
	Avatar,
	Button,
} from "@rneui/themed";

import { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatRelative, parseISO } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";

import { fetchTweet, putLike, postNoti } from "./apiCalls";

export default function Tweet({ authUser, auth }) {
	const navigation = useNavigation();
	const route = useRoute();

	const { _id } = route.params;

	const [isLoading, setIsLoading] = useState(true);
	const [tweet, setTweet] = useState({});

	useEffect(() => {
		(async () => {
			let result = await fetchTweet(_id);
			setTweet(result);
			setIsLoading(false);
		})();
	}, [isLoading]);

	const toggleLike = id => {
		if (!auth) return false;

		(async () => {
			let likes = await putLike(id);
			// if (!likes) return navigate("/error");

			let updatedTweet = await fetchTweet(id);
			if (!updatedTweet) return navigate("/error");

			setTweet(updatedTweet);
			postNoti("like", id);
		})();
	}

	const toggleLikeForComment = (commentId, tweetId) => {
		if (!auth) return false;

		(async () => {
			let likes = await putLike(commentId);
			// if (!likes) return navigate("/error");

			let result = await fetchTweet(tweetId);
			// if (!result) return navigate("/error");

			setTweet(result);
		})();
	}

	return (
		<ScrollView>
			{!isLoading &&
				<View key={tweet._id}>
					<Card>
						<View>
							<View style={{ flexDirection: "row" }}>
								<Avatar
									size={48}
									rounded
									title="T"
									containerStyle={{ backgroundColor: "#0a5" }}
								/>
								<View style={{ marginLeft: 10, marginTop: 5 }}>
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

								{(
									tweet.origin_tweet[0] &&

									<View
										style={{
											backgroundColor: "#f5f5f5",
											padding: 15,
											marginTop: 15,
											borderRadius: 4
										}}
									>
										<View style={{ flex: 1, flexDirection: "row" }}>
											<Avatar
												size={32}
												rounded
												title="O"
												containerStyle={{ backgroundColor: "grey" }}
											/>
											<View style={{ marginLeft: 20, flexShrink: 1 }}>
												<View style={{ marginTop: 10 }}>
													<View
														style={{
															flex: 1,
															flexDirection: "row",
															flexWrap: "wrap",
														}}
													>
														<Text
															style={{
																fontSize: 14,
																fontWeight: "bold",
																marginRight: 6
															}}
														>
															{tweet.origin_tweet[0].user[0].name}
														</Text>

														<Text
															style={{
																fontSize: 14,
																color: "grey",
																marginRight: 10,
															}}
														>
															@{tweet.origin_tweet[0].user[0].handle}
														</Text>

														<Text style={{ fontSize: 14, color: "#5ad" }}>
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
														navigation.replace("Tweet", {
															_id: tweet.origin_tweet[0]._id
														});
													}}
												>
													<View style={{ marginTop: 10 }}>
														<Text style={{ fontSize: 14 }}>{tweet.origin_tweet[0].body}</Text>
													</View>
												</TouchableOpacity>
											</View>
										</View>
									</View>
								)}

								{(tweet.origin && !tweet.origin_tweet[0]) &&
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
								toggleLike(tweet._id);
							}}>
								{
									tweet.likes &&
										tweet.likes.includes(authUser._id)
										? <Ionicons name="heart" size={24} color="red" />
										: <Ionicons name="heart-outline" size={24} color="red" />
								}
								<Text style={{ marginLeft: 5 }}>{tweet.likes.length}</Text>
							</Button>

							<Button type="clear">
								<Ionicons name="share-social-outline" size={24} color="#09a" />
								<Text style={{ marginLeft: 5 }}>{tweet.shares.length}</Text>
							</Button>
							<Button type="clear">
								<Ionicons name="chatbubble-outline" size={24} color="green" />
								<Text style={{ marginLeft: 5 }}>{tweet.comments.length}</Text>
							</Button>
						</View>
					</Card>

					{tweet.comments.map(comment => {
						return (
							<Card key={comment._id}>
								<View style={{ flex: 1, flexDirection: "row" }}>
									<Avatar
										size={32}
										rounded
										title="C"
										containerStyle={{ backgroundColor: "grey" }}
									/>
									<View style={{ marginLeft: 20, flexShrink: 1 }}>
										<View style={{ marginTop: 10 }}>
											<View style={{ flexDirection: "row" }}>
												<Text 
													style={{ 
														fontSize: 14, 
														fontWeight: "bold", 
														marginRight: 6 
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

								<View 
									style={{ 
										flexDirection: "row", 
										marginTop: 10, 
										justifyContent: "space-around" 
									}}
								>

									<Button type="clear" onPress={() => {
										toggleLikeForComment(comment._id, tweet._id);
									}}>
										{
											comment.likes &&
												comment.likes.includes(authUser._id)
												? <Ionicons name="heart" size={24} color="red" />
												: <Ionicons name="heart-outline" size={24} color="red" />
										}
										<Text style={{ marginLeft: 5 }}>{comment.likes.length}</Text>
									</Button>

									<Button type="clear">
										<Ionicons name="share-social-outline" size={24} color="#09a" />
										<Text style={{ marginLeft: 5 }}>{comment.shares.length}</Text>
									</Button>
									<Button type="clear">
										<Ionicons name="chatbubble-outline" size={24} color="green" />
										<Text style={{ marginLeft: 5 }}>{comment.comments.length}</Text>
									</Button>
								</View>
							</Card>
						)
					})}
				</View>
			}
		</ScrollView>
	);
}
