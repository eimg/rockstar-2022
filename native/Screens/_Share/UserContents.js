import { useEffect, useState, useCallback } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";

import {
    Text,
    Card,
    Avatar,
    Button,
    ButtonGroup,
    useTheme,
} from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-root-toast";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formatRelative, parseISO } from "date-fns";

import {
    putLike,
    postNoti,
    fetchTweetsByHandle,
    fetchCommentsByHandle,
    fetchLikedTweetsByHandle,
    deleteTweet,
} from "../../apiCalls";

import Attachment from "./Attachment";
import ActionButtons from "./ActionButtons";

export default function UserContents({ authUser, handle, auth }) {
    const [selectedButton, setSelectedButton] = useState(0);

    const [tweets, setTweets] = useState([]);
    const [comments, setComments] = useState([]);
    const [likedTweets, setLikedTweets] = useState([]);

    const { theme } = useTheme();

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

    useFocusEffect(
        useCallback(() => {
            (async () => {
                let result = await fetchTweetsByHandle(handle);
                setTweets(result);
            })();
        }, [])
    );

    const toggleLike = (id) => {
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
    };

    const removeTweet = (tweet, tweets) => {
        deleteTweet(tweet._id);
        setTweets(tweets.filter((t) => t._id !== tweet._id));

        Toast.show("A tweet deleted", {
            duration: Toast.durations.LONG,
        });
    };

    const removeComment = (tweet, tweets) => {
        deleteTweet(tweet._id);
        setComments(tweets.filter((t) => t._id !== tweet._id));

        Toast.show("A tweet deleted", {
            duration: Toast.durations.LONG,
        });
    };

    const removeLike = (tweet, tweets) => {
        deleteTweet(tweet._id);
        setLikedTweets(tweets.filter((t) => t._id !== tweet._id));

        Toast.show("A tweet deleted", {
            duration: Toast.durations.LONG,
        });
    };

    return (
        <View>
            <ButtonGroup
                selectedIndex={selectedButton}
                buttons={["Recent", "Comments", "Likes"]}
                onPress={(value) => {
                    setSelectedButton(value);
                }}
                containerStyle={{
                    marginHorizontal: 15,
                    marginTop: 20,
                    borderColor: "grey",
                }}
                buttonStyle={{ backgroundColor: theme.colors.background }}
            />
            <ScrollView>
                <TweetList
                    auth={auth}
                    handle={handle}
                    tweets={tweets}
                    authUser={authUser}
                    toggleLike={toggleLike}
                    show={selectedButton === 0}
                    remove={removeTweet}
                />

                <TweetList
                    auth={auth}
                    handle={handle}
                    tweets={comments}
                    authUser={authUser}
                    toggleLike={toggleLike}
                    show={selectedButton === 1}
                    remove={removeComment}
                />

                <TweetList
                    auth={auth}
                    handle={handle}
                    authUser={authUser}
                    tweets={likedTweets}
                    toggleLike={toggleLike}
                    show={selectedButton === 2}
                    remove={removeLike}
                />
            </ScrollView>
        </View>
    );
}

function TweetList({ authUser, auth, tweets, toggleLike, show, remove }) {
    const navigation = useNavigation();

    return (
        show &&
        tweets.map((tweet) => {
            return (
                <View key={tweet._id}>
                    <Card>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{ flexDirection: "row", flexShrink: 1 }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("User", {
                                            handle: tweet.user[0].handle,
                                        });
                                    }}
                                >
                                    <Avatar
                                        rounded
                                        size={48}
                                        title={tweet.user[0].name[0].toUpperCase()}
                                        containerStyle={{
                                            backgroundColor: "#0a5",
                                        }}
                                    />
                                </TouchableOpacity>

                                <View style={{ marginLeft: 10, flexShrink: 1 }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            marginTop: 5,
                                        }}
                                    >
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

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#5ad",
                                            }}
                                        >
                                            {formatRelative(
                                                parseISO(tweet.created),
                                                new Date()
                                            )}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate("Tweet", {
                                                _id: tweet._id,
                                            });
                                        }}
                                    >
                                        <View style={{ marginTop: 5 }}>
                                            <Text style={{ fontSize: 14 }}>
                                                {tweet.body}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <Attachment tweet={tweet} />
                                </View>
                            </View>

                            {tweet.owner === authUser._id && (
                                <Button
                                    size="sm"
                                    type="clear"
                                    buttonStyle={{ padding: 0 }}
                                    onPress={() => {
                                        remove(tweet, tweets);
                                    }}
                                >
                                    <Ionicons
                                        name="close-outline"
                                        size={24}
                                        color="grey"
                                    />
                                </Button>
                            )}
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
