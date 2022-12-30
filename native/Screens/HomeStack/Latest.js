import { useEffect, useState, useCallback } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";

import { Card, Avatar, } from "@rneui/themed";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formatRelative, parseISO } from "date-fns";

import { fetchTweets, putLike, postNoti } from "../../apiCalls";

import ActionButtons from "../_Share/ActionButtons";
import Attachment from "../_Share/Attachment";

export default function Latest({ auth, authUser }) {
	const navigation = useNavigation();
	const [tweets, setTweets] = useState([]);

	useEffect(() => {
		(async () => {
			let result = await fetchTweets();
			// handle api error here

			setTweets(result);
		})();
	}, []);

	useFocusEffect(useCallback(() => {
		(async () => {
			let result = await fetchTweets();
			// handle api error here

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
									navigation.navigate("User", { handle: tweet.user[0].handle });
								}}>
									<Avatar
										rounded
										size={48}
										title={tweet.user[0].name[0].toUpperCase()}
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

									<Attachment tweet={tweet} />
								</View>
							</View>

							<ActionButtons 
								auth={auth} 
								tweet={tweet} 
								authUser={authUser} 
								toggleLike={toggleLike} 
							/>
						</Card>
					</View>
				);
			})}
		</ScrollView>
	);
}
