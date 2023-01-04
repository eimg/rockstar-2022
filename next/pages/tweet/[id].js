import Head from "next/head";

import { useState, useEffect, useContext } from "react";

import { putLike, fetchTweet, postNoti } from "../../utils/apiCalls";

import SingleTweet from "../components/SingleTweet";

import { AuthContext } from "../components/AuthProvider";

import { useRouter } from "next/router";

export default function Tweet() {
	const router = useRouter();
	const { id } = router.query;

	const [tweet, setTweet] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	const { authStatus } = useContext(AuthContext);

	useEffect(() => {
		(async () => {
			let result = await fetchTweet(id);
			// if (!result) return navigate("/error");

			if (result) {
				setTweet(result);
				setIsLoading(false);
			}
		})();
	}, [id]);

	const toggleLike = id => {
		if (!authStatus) return false;

		(async () => {
			let likes = await putLike(id);
			// if (!likes) return navigate("/error");

			let result = await fetchTweet(id);
			// if (!result) return navigate("/error");

			setTweet(result);
			postNoti("like", id);
		})();
	};

	const toggleLikeForComment = (commentId, tweetId) => {
		if (!authStatus) return false;

		(async () => {
			let likes = await putLike(commentId);
			// if (!likes) return navigate("/error");

			let result = await fetchTweet(tweetId);
			// if (!result) return navigate("/error");

			setTweet(result);
		})();
	};

	const addComment = reply => {
		tweet.comments.push(reply);
		setTweet({ ...tweet });
		postNoti("comment", id);
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
				{!isLoading && (
					<SingleTweet
						tweet={tweet}
						toggleLike={toggleLike}
						toggleLikeForComment={toggleLikeForComment}
						addComment={addComment}
					/>
				)}
			</main>
		</>
	);
}
