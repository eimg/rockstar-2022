import { useEffect, useState, useCallback } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";

import {
	Card,
	Avatar,
	ButtonGroup,
} from "@rneui/themed";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formatRelative, parseISO } from "date-fns";

import {
	putLike,
	postNoti,
	fetchTweetsByHandle,
	fetchCommentsByHandle,
	fetchLikedTweetsByHandle,
} from "../../apiCalls";

import Attachment from "./Attachment";
import ActionButtons from "./ActionButtons";

export default function UserContents({ authUser, handle, auth }) {
	const [selectedButton, setSelectedButton] = useState(0);

	const [tweets, setTweets] = useState([]);
	const [comments, setComments] = useState([]);
	const [likedTweets, setLikedTweets] = useState([]);

	useEffect(() => {
		(async () => {
			let tweets = await fetchTweetsByHandle(handle);
			// handle api error here
			setTweets(tweets);

			let comments = await fetchCommentsByHandle(handle);
			// handle api error here
			setComments(comments);

			let likedTweets = await fetchLikedTweetsByHandle(handle);
			// handle api error here
			setLikedTweets(likedTweets);
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
		<View>
			<ButtonGroup
				selectedIndex={selectedButton}
				buttons={["Recent", "Comments", "Likes"]}
				onPress={(value) => {
					setSelectedButton(value);
				}}
				containerStyle={{ marginBottom: 20 }}
			/>
			<ScrollView>
				<TweetList
					auth={auth}
					handle={handle}
					tweets={tweets}
					authUser={authUser}
					toggleLike={toggleLike}
					show={selectedButton === 0}
				/>

				<TweetList
					auth={auth}
					handle={handle}
					tweets={comments}
					authUser={authUser}
					toggleLike={toggleLike}
					show={selectedButton === 1}
				/>

				<TweetList
					auth={auth}
					handle={handle}
					authUser={authUser}
					tweets={likedTweets}
					toggleLike={toggleLike}
					show={selectedButton === 2}
				/>
			</ScrollView>
		</View>
	);
}

function TweetList({ authUser, auth, tweets, toggleLike, show }) {
	const navigation = useNavigation();

	return (
		show &&
		tweets.map(tweet => {
			return (
				<View key={tweet._id}>
					<Card>
						<View style={{ flex: 1, flexDirection: "row" }}>
							<TouchableOpacity onPress={() => {
								navigation.navigate("User", { handle: tweet.user[0].handle })
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
		})
	);
}
