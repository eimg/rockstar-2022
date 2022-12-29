import { useEffect, useState, useCallback } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";

import {
	Card,
	Avatar,
	Button,
} from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import Toast from 'react-native-root-toast';
import { formatRelative, parseISO } from "date-fns";

import { fetchTweetsByHandle, putLike, postNoti } from "../../apiCalls";

export default function UserContents({ authUser, handle, auth }) {
	const navigation = useNavigation();
	const [tweets, setTweets] = useState([]);

	useEffect(() => {
		(async () => {
			let result = await fetchTweetsByHandle(handle);
			setTweets(result);
		})();
	}, []);

	useFocusEffect(useCallback(() => {
		(async () => {
			let result = await fetchTweetsByHandle(handle);
			setTweets(result);
		})();
	}, []));

	const toggleLike = id => {
		if (!auth) return false;

		(async () => {
			let likes = await putLike(id);
			// handle api error here

			let updatedTweets = await Promise.all(
				tweets.map(async (tweet) => {
					if (tweet._id === id) {
						tweet.likes = likes;
					}

					return tweet;
				})
			);

			setTweets(updatedTweets);
			postNoti("like", id);
		})();
	}

	return (
		<ScrollView>
			{tweets.map(tweet => {
				return (
					<View key={tweet._id}>
						<Card>
							<View style={{ flex: 1, flexDirection: "row" }}>
								<TouchableOpacity onPress={() => {
									navigation.navigate('User', { handle: tweet.user[0].handle })
								}}>
									<Avatar
										rounded
										title={tweet.user[0].name[0].toUpperCase()}
										size={48}
										containerStyle={{ backgroundColor: "#0a5" }}
									/>
								</TouchableOpacity>
								<View style={{ marginLeft: 10, flexShrink: 1 }}>
									<View style={{ marginTop: 5 }}>
										<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
											<Text
												style={{
													fontSize: 14,
													fontWeight: "bold",
													marginRight: 6,
												}}
											>
												{tweet.user[0].name}
											</Text>

											<Text
												style={{
													fontSize: 14,
													color: "grey",
													marginRight: 10,
												}}
											>
												@{tweet.user[0].handle}
											</Text>

											<Text style={{ fontSize: 14, color: "#5ad" }}>
												{
													formatRelative(
														parseISO(tweet.created), new Date()
													)
												}
											</Text>
										</View>
									</View>

									<TouchableOpacity onPress={() => {
										navigation.navigate("Tweet", { _id: tweet._id });
									}}>
										<View style={{ marginTop: 5 }}>
											<Text style={{ fontSize: 14 }}>{tweet.body}</Text>
										</View>
									</TouchableOpacity>

									{(
										tweet.origin_tweet[0] &&

										<View
											style={{
												backgroundColor: "#f5f5f5",
												padding: 15,
												marginTop: 15,
												borderRadius: 4,
											}}
										>
											<View style={{ flex: 1, flexDirection: "row" }}>
												<TouchableOpacity onPress={() => {
													navigation.navigate('User', { handle: tweet.origin_tweet[0].user[0].handle })
												}}>
													<Avatar
														rounded
														size={32}
														containerStyle={{ backgroundColor: "grey" }}
														title={
															tweet.origin_tweet[0]
																.user[0].name[0].toUpperCase()
														}
													/>
												</TouchableOpacity>

												<View style={{ marginLeft: 10, flexShrink: 1 }}>
													<View style={{ marginTop: 5 }}>
														<View
															style={{
																flex: 1,
																flexDirection: "row",
																flexWrap: "wrap",
															}}
														>
															<Text
																style={{
																	fontSize: 12,
																	fontWeight: "bold",
																	marginRight: 6,
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

								</View>
							</View>

							<View
								style={{
									marginTop: 10,
									flexDirection: "row",
									justifyContent: "space-around",
								}}
							>
								<Button type="clear" onPress={() => {
									if (auth) toggleLike(tweet._id);
									else Toast.show('Login required to like', {
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
									if (auth) navigation.navigate('Share', { id: tweet._id });
									else Toast.show('Login required to share', {
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
					</View>
				);
			})}
		</ScrollView>
	);
}
