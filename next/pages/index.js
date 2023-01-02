import Head from "next/head";

import { useState, useEffect, useContext } from "react";

import {
    putLike,
    fetchTweets,
    postNoti,
} from "../utils/apiCalls";

import Layout from "./components/Layout";
import Latest from "./components/Latest"
import { AuthContext } from "./components/AuthProvider";

export default function Index() {
    const [tweets, setTweets] = useState([]);

    const { authStatus } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            let result = await fetchTweets();
            // if (!result) return navigate("/error");

            setTweets(result);
        })();
    }, []);

    const toggleLike = (id) => {
        if (!authStatus) return false;

        (async () => {
            let likes = await putLike(id);
            // if (!likes) return navigate("/error");

            let updatedTweets = tweets.map((tweet) => {
                if (tweet._id === id) {
                    tweet.likes = likes;
                }

                return tweet;
            });

            setTweets(updatedTweets);
            postNoti("like", id);
        })();
    };

    return (
        <>
            <Head>
                <title>Next Twitter</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Layout>
                    <Latest
                        tweets={tweets}
                        toggleLike={toggleLike}
                    />
                </Layout>
            </main>
        </>
    );
}
