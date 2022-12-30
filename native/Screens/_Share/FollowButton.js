import { Button } from "@rneui/themed";

import { putFollow } from "../../apiCalls";

export default function FollowButton({ authUser, user, setAuthUser }) {
    if (!authUser._id || authUser._id === user._id) {
        return <></>;
    }

    return authUser.following &&
        authUser.following.find((uid) => uid === user._id) ? (
        <Button
            size="sm"
            type="outline"
            onPress={() => {
                (async () => {
                    let result = await putFollow(user._id);
                    // handle api error here

                    authUser.following = result.following;

                    setAuthUser({ ...authUser });
                })();
            }}
        >
            Followed
        </Button>
    ) : (
        <Button
            size="sm"
            type="solid"
            onPress={() => {
                (async () => {
                    let result = await putFollow(user._id);
                    // handle api error here

                    authUser.following = result.following;

                    setAuthUser({ ...authUser });
                })();
            }}
        >
            Follow
        </Button>
    );
}
