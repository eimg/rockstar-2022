import { useEffect, useState } from "react";

import { useRoute } from "@react-navigation/native";

import { fetchLikes } from "../../apiCalls";
import UserList from "../_Share/UserList";

export default function Likes({ authUser, setAuthUser }) {
    const route = useRoute();

    const [likedUsers, setLikedUsers] = useState([]);
    const { id } = route.params;

    useEffect(() => {
        (async () => {
            let result = await fetchLikes(id);
            // handle api error here

            setLikedUsers(result);
        })();
    }, [id]);

    return (
        <UserList
            authUser={authUser}
            setAuthUser={setAuthUser}
            users={likedUsers}
        />
    );
}
