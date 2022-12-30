import { View } from "react-native";
import { Button, Text, useTheme } from "@rneui/themed";

import { useNavigation } from "@react-navigation/native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-root-toast";

export default function ActionButtons({
    auth,
    authUser,
    tweet,
    toggleLike,
    parentTweet,
}) {
    const navigation = useNavigation();

    const { theme } = useTheme();

    return (
        <View
            style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-around",
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Button
                    type="clear"
                    onPress={() => {
                        const tweetId = tweet._id;
                        const parentId = parentTweet && parentTweet._id;

                        if (auth) {
                            toggleLike(tweetId, parentId);
                        } else {
                            Toast.show("Login required to like", {
                                duration: Toast.durations.LONG,
                            });
                        }
                    }}
                >
                    {tweet.likes && tweet.likes.includes(authUser._id) ? (
                        <Ionicons
                            name="heart"
                            size={24}
                            color={theme.colors.error}
                        />
                    ) : (
                        <Ionicons
                            name="heart-outline"
                            size={24}
                            color={theme.colors.error}
                        />
                    )}
                </Button>
                <Button
                    type="clear"
                    onPress={() => {
                        navigation.navigate("Likes", { id: tweet._id });
                    }}
                >
                    <Text style={{ marginLeft: 5 }}>
                        {tweet.likes && tweet.likes.length}
                    </Text>
                </Button>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Button
                    type="clear"
                    onPress={() => {
                        if (auth)
                            navigation.navigate("Share", { id: tweet._id });
                        else
                            Toast.show("Login required to share", {
                                duration: Toast.durations.LONG,
                            });
                    }}
                >
                    <Ionicons
                        name="share-social-outline"
                        size={24}
                        color={theme.colors.primary}
                    />
                </Button>
                <Button
                    type="clear"
                    onPress={() => {
                        navigation.navigate("Shares", { id: tweet._id });
                    }}
                >
                    <Text style={{ marginLeft: 5 }}>{tweet.shares.length}</Text>
                </Button>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Button
                    type="clear"
                    onPress={() => {
                        navigation.navigate("Tweet", { _id: tweet._id });
                    }}
                >
                    <Ionicons
                        name="chatbubble-outline"
                        size={24}
                        color={theme.colors.success}
                    />
                </Button>
                <Button
                    type="clear"
                    onPress={() => {
                        navigation.navigate("Tweet", { _id: tweet._id });
                    }}
                >
                    <Text style={{ marginLeft: 5 }}>
                        {tweet.comments.length}
                    </Text>
                </Button>
            </View>
        </View>
    );
}
