import {
	Card,
	Avatar,
	Button,
} from "@rneui/themed";

import { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { formatRelative, parseISO } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";

import { fetchTweets } from "./apiCalls";

export default function Latest({ auth, authUser }) {
	const navigation = useNavigation();
	let [tweets, setTweets] = useState([]);

	useEffect(() => {
		(async () => {
			let result = await fetchTweets();
			setTweets(result);
		})();
	}, []);

	return (
		<ScrollView>
			{tweets.map(tweet => {
				return (
					<View key={tweet._id}>
						<Card>
							<View style={{ flex: 1, flexDirection: "row" }}>
								<Avatar
									rounded
									title="T"
									size={48}
									containerStyle={{ backgroundColor: "#0a5" }}
								/>
								<View style={{ marginLeft: 10, flexShrink: 1 }}>
									<View style={{ marginTop: 5 }}>
										<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
											<Text 
												style={{ 
													fontSize: 14, 
													fontWeight: "bold", 
													marginRight: 6 
												}}
											>
												{tweet.user[0].name}
											</Text>

											<Text 
												style={{ 
													fontSize: 14, 
													color: "grey", 
													marginRight: 10 
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
									flexDirection: "row", 
									marginTop: 10, 
									justifyContent: "space-around", 
								}}
							>

								{
									tweet.likes &&
										tweet.likes.includes(authUser._id)
										? <Button type="clear">
											<Ionicons name="heart" size={24} color="red" />
											<Text style={{ marginLeft: 5 }}>{tweet.likes.length}</Text>
										</Button>
										: <Button type="clear">
											<Ionicons name="heart-outline" size={24} color="red" />
											<Text style={{ marginLeft: 5 }}>{tweet.likes.length}</Text>
										</Button>
								}

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
					</View>
				);
			})}
		</ScrollView>
	);
}