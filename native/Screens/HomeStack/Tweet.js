import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";

import { Card, Avatar, Button, Input, Text, useTheme } from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useNavigation, useRoute } from "@react-navigation/native";
import { formatRelative, parseISO } from "date-fns";

import Toast from "react-native-root-toast";

import {
    fetchTweet,
    putLike,
    postNoti,
    postReply,
    deleteTweet,
} from "../../apiCalls";
import ActionButtons from "../_Share/ActionButtons";
import Attachment from "../_Share/Attachment";

export default function Tweet({ authUser, auth }) {
    const route = useRoute();
    const navigation = useNavigation();

    const { theme } = useTheme();

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

    const toggleLike = (tweetId, parentId) => {
        if (!auth) return false;

        (async () => {
            let likes = await putLike(tweetId);
            // handle api error here

            // If parentId exists, assuming
            // it"s a comment and refetching
            // entire parent tweet
            let updatedTweet = parentId
                ? await fetchTweet(parentId)
                : await fetchTweet(tweetId);

            setTweet(updatedTweet);
            postNoti("like", tweetId);
        })();
    };

    return (
        <ScrollView>
            {!isLoading && (
                <View key={tweet._id}>
                    <Card>
                        <View>
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
                                            size={48}
                                            rounded
                                            title="T"
                                            containerStyle={{
                                                backgroundColor:
                                                    theme.colors.success,
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            marginLeft: 10,
                                            marginTop: 5,
                                            flexShrink: 1,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                marginBottom: 5,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                    marginRight: 6,
                                                }}
                                            >
                                                {tweet.user[0].name}
                                            </Text>

                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    color: "#5ad",
                                                }}
                                            >
                                                {formatRelative(
                                                    parseISO(tweet.created),
                                                    new Date()
                                                )}
                                            </Text>
                                        </View>

                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: "grey",
                                                marginRight: 10,
                                            }}
                                        >
                                            @{tweet.user[0].handle}
                                        </Text>
                                    </View>
                                </View>

                                {tweet.owner === authUser._id && (
                                    <Button
                                        size="sm"
                                        type="clear"
                                        buttonStyle={{ padding: 0 }}
                                        onPress={() => {
                                            deleteTweet(tweet._id);
                                            navigation.navigate("Latest");
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

                            <View style={{ marginTop: 20 }}>
                                <View>
                                    <Text style={{ fontSize: 20 }}>
                                        {tweet.body}
                                    </Text>
                                </View>

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

                    {tweet.comments.map((comment) => {
                        return (
                            <View key={comment._id}>
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
                                                    navigation.navigate(
                                                        "User",
                                                        {
                                                            handle: comment
                                                                .user[0].handle,
                                                        }
                                                    );
                                                }}
                                            >
                                                <Avatar
                                                    rounded
                                                    size={32}
                                                    title={comment.user[0].name[0].toUpperCase()}
                                                    containerStyle={{
                                                        backgroundColor:
                                                            theme.colors
                                                                .secondary,
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
                                                        {comment.user[0].name}
                                                    </Text>

                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            color: "grey",
                                                            marginRight: 10,
                                                        }}
                                                    >
                                                        @
                                                        {comment.user[0].handle}
                                                    </Text>

                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            color: theme.colors
                                                                .lightBlue,
                                                        }}
                                                    >
                                                        {formatRelative(
                                                            parseISO(
                                                                comment.created
                                                            ),
                                                            new Date()
                                                        )}
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        navigation.navigate(
                                                            "Tweet",
                                                            { _id: comment._id }
                                                        );
                                                    }}
                                                >
                                                    <View
                                                        style={{ marginTop: 5 }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                            }}
                                                        >
                                                            {comment.body}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {comment.owner === authUser._id && (
                                            <Button
                                                size="sm"
                                                type="clear"
                                                buttonStyle={{ padding: 0 }}
                                                onPress={() => {
                                                    deleteTweet(comment._id);

                                                    tweet.comments =
                                                        tweet.comments.filter(
                                                            (c) =>
                                                                c._id !==
                                                                comment._id
                                                        );

                                                    setTweet({ ...tweet });

                                                    Toast.show(
                                                        "A comment deleted",
                                                        {
                                                            duration:
                                                                Toast.durations
                                                                    .LONG,
                                                        }
                                                    );
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
                                        parentTweet={tweet}
                                        tweet={comment}
                                        authUser={authUser}
                                        toggleLike={toggleLike}
                                    />
                                </Card>
                            </View>
                        );
                    })}

                    {auth && (
                        <View style={{ margin: 20 }}>
                            <Input
                                value={body}
                                multiline={true}
                                onChangeText={setBody}
                                style={{ height: 80 }}
                                placeholder="Your reply"
                            />
                            <Button
                                onPress={() => {
                                    if (!body) return;

                                    (async () => {
                                        let result = await postReply(
                                            tweet._id,
                                            body
                                        );
                                        // handle api error here

                                        let update = await fetchTweet(_id);
                                        // handle api error here

                                        setTweet(update);

                                        Toast.show("You reply is posted", {
                                            duration: Toast.durations.LONG,
                                        });

                                        setBody("");
                                    })();
                                }}
                            >
                                Reply
                            </Button>
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
}
