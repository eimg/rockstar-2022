const apiBase = "http://localhost:8000";

export function getToken() {
    return localStorage.getItem("token") || false;
}

export async function login(handle, password) {
    const res = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ handle, password }),
    });

    if (res.ok) {
        let result = await res.json();
        localStorage.setItem("token", result.token);

        return result;
    }

    return false;
}

export async function register(name, handle, profile, password) {
    const res = await fetch(`${apiBase}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, handle, profile, password }),
    });

    if (res.status === 409) {
        return 409;
    }

    if (res.ok) {
        let result = await res.json();
        localStorage.setItem("token", result.token);

        return result;
    }

    return false;
}

export async function updateProfile(_id, name, profile, password) {
    const res = await fetch(`${apiBase}/users/${_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, profile, password }),
    });

    if (res.ok) {
        let result = await res.json();
        return result;
    }

    return false;
}

export async function fetchUsers(q = "") {
    const res = await fetch(`${apiBase}/users?q=${q}`);

    if (res.ok) {
        let result = await res.json();
        return result;
    }

    return false;
}

export async function fetchUser() {
    const token = getToken();

    if (!token) return false;

    const res = await fetch(`${apiBase}/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.ok) {
        let result = await res.json();
        return result;
    }

    return false;
}

export async function fetchUserByHandle(handle) {
    const res = await fetch(`${apiBase}/users/${handle}`);

    if (res.ok) {
        try {
            let result = await res.json();
            return result;
        } catch {
            return false;
        }
    }

    return false;
}

export async function fetchTweets() {
    const res = await fetch(`${apiBase}/tweets`);

    if (res.ok) {
        let result = await res.json();
        return result.data;
    }

    return false;
}

export async function fetchTweetsByHandle(handle) {
    const res = await fetch(`${apiBase}/tweets/users/${handle}`);

    if (res.ok) {
        let result = await res.json();
        return result.data;
    }

    return false;
}

export async function fetchCommentsByHandle(handle) {
    const res = await fetch(`${apiBase}/comments/users/${handle}`);

    if (res.ok) {
        let result = await res.json();
        return result.data;
    }

    return false;
}

export async function fetchLikedTweetsByHandle(handle) {
    const res = await fetch(`${apiBase}/tweets/users/${handle}/liked`);

    if (res.ok) {
        let result = await res.json();
        return result.data;
    }

    return false;
}

export async function fetchTweet(_id) {
    const res = await fetch(`${apiBase}/tweets/${_id}`);

    if (res.ok) {
        let tweet = await res.json();
        return tweet.data;
    }

    return false;
}

export async function postTweet(tweet) {
    const token = getToken();

    const res = await fetch(`${apiBase}/tweets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tweet }),
    });

    if (res.ok) {
        let result = await res.json();
        return result[0];
    }

    return false;
}

export async function postReply(_id, reply) {
    const token = getToken();

    const res = await fetch(`${apiBase}/reply/${_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tweet: reply }),
    });

    if (res.ok) {
        let result = await res.json();
        return result[0];
    }

    return false;
}

export async function postShare(_id, tweet) {
    const token = getToken();

    const res = await fetch(`${apiBase}/tweets/${_id}/share`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tweet }),
    });

    if (res.ok) {
        let result = await res.json();
        return result[0];
    }

    return false;
}

export async function deleteTweet(_id) {
    const token = getToken();

    const res = await fetch(`${apiBase}/tweets/${_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.ok;
}

export async function putLike(_id) {
    const token = getToken();

    const res = await fetch(`${apiBase}/tweets/${_id}/like`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.ok) {
        let result = await res.json();
        return result;
    }

    return false;
}

export async function putFollow(_id) {
    const token = getToken();

    const res = await fetch(`${apiBase}/users/${_id}/follow`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.ok) {
        let result = await res.json();
        return result;
    }

    return false;
}

export async function fetchNotis() {
    const token = getToken();

    const res = await fetch(`${apiBase}/notis`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.ok) {
        let notis = await res.json();
        return notis;
    }

    return false;
}

export async function postNoti(type, target) {
    const token = getToken();

    const res = await fetch(`${apiBase}/notis`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, target }),
    });

    if (res.ok) {
        let noti = await res.json();
        return noti;
    }

    return false;
}

export async function markNotiRead(_id) {
    const token = getToken();

    const res = await fetch(`${apiBase}/notis/${_id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.ok;
}

export async function markAllNotisRead() {
    const token = getToken();

    const res = await fetch(`${apiBase}/notis`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.ok;
}

export async function fetchLikes(_id) {
    const res = await fetch(`${apiBase}/tweets/${_id}`);

    if (res.ok) {
        let result = await res.json();
        return result.data.likes_users || [];
    }

    return false;
}

export async function fetchFollowers(handle) {
    const res = await fetch(`${apiBase}/users/${handle}`);

    if (res.ok) {
        let result = await res.json();
        return result.followers_users || [];
    }

    return false;
}

export async function fetchFollowing(handle) {
    const res = await fetch(`${apiBase}/users/${handle}`);

    if (res.ok) {
        let result = await res.json();
        return result.following_users || [];
    }

    return false;
}

export async function fetchShares(_id) {
    const res = await fetch(`${apiBase}/tweets/${_id}`);

    if (res.ok) {
        let result = await res.json();
        return result.data.shares || [];
    }

    return false;
}
