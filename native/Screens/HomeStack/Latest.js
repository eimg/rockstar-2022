import { useEffect, useState, useCallback } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";

import { Card, Avatar, Button, Text, useTheme } from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-root-toast";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formatRelative, parseISO } from "date-fns";

import { fetchTweets, putLike, postNoti, deleteTweet } from "../../apiCalls";

import ActionButtons from "../_Share/ActionButtons";
import Attachment from "../_Share/Attachment";

export default function Latest({ auth, authUser }) {
    const navigation = useNavigation();
    const [tweets, setTweets] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        (async () => {
            let result = await fetchTweets();
            // handle api error here

            setTweets(result);
        })();
    }, []);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                let result = await fetchTweets();
                // handle api error here

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

    return (
        <ScrollView>
            {tweets.map((tweet) => {
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
                                    style={{
                                        flexDirection: "row",
                                        flexShrink: 1,
                                    }}
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
                                                backgroundColor:
                                                    theme.colors.success,
                                            }}
                                        />
                                    </TouchableOpacity>

                                    <View
                                        style={{
                                            marginLeft: 10,
                                            flexShrink: 1,
                                        }}
                                    >
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
                                                    color: theme.colors
                                                        .lightBlue,
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
                                            deleteTweet(tweet._id);
                                            setTweets(
                                                tweets.filter(
                                                    (t) => t._id !== tweet._id
                                                )
                                            );

                                            Toast.show("A tweet deleted", {
                                                duration: Toast.durations.LONG,
                                            });
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
            })}
        </ScrollView>
    );
}
