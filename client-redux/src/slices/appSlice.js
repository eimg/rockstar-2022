import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTweets, fetchTweet, putLike, postNoti } from "../apiCalls";

export const appSlice = createSlice({
	name: "app",
	initialState: {
		tweets: [],
		notis: [],
		status: "idle",
	},
	reducers: {
		setNotis: (state, action) => {
			state.notis = action.payload;
		},
		readNoti: (state, action) => {
			state.notis = state.notis.map(noti => {
				if (noti._id === action.payload) noti.read = true;
				return noti;
			});
		},
		readAllNotis: (state, action) => {
			state.notis = state.notis.map(noti => {
				noti.read = true;
				return noti;
			});
		},
		addTweet: (state, action) => {
			state.tweets = [action.payload, ...state.tweets];
		},
		addComment: (state, action) => {
			state.tweets = state.tweets.map(tweet => {
				if (tweet._id === action.payload.origin) {
					tweet.comments.push(action.payload);
				}

				return tweet;
			});
		},
		toggleLike: (state, action) => {
			// these should be in thunks
			putLike(action.payload.target);
			postNoti("like", action.payload.target);

			state.tweets = state.tweets.map(tweet => {
				if (action.payload.parent) {
					if (tweet._id === action.payload.parent) {
						// toggle like on deep nested comment
						tweet.comments.map(comment => {
							if (comment._id === action.payload.target) {
								if (
									comment.likes.includes(action.payload.actor)
								) {
									comment.likes = comment.likes.filter(
										actor => actor !== action.payload.actor,
									);
								} else {
									comment.likes.push(action.payload.actor);
								}
							}

							return comment;
						});
					}
				} else {
					// toggle like for tweet
					if (tweet._id === action.payload.target) {
						if (tweet.likes.includes(action.payload.actor)) {
							tweet.likes = tweet.likes.filter(
								actor => actor !== action.payload.actor,
							);
						} else {
							tweet.likes.push(action.payload.actor);
						}
					}
				}

				return tweet;
			});
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchLatest.pending, state => {
				state.status = "loading";
			})
			.addCase(fetchLatest.fulfilled, (state, action) => {
				state.status = "idle";
				state.tweets = action.payload;
			})
			.addCase(fetchSingle.pending, state => {
				state.status = "loading";
			})
			.addCase(fetchSingle.fulfilled, (state, action) => {
				state.status = "idle";

				// adding one more tweet on the go
				// if not exists in initial state
				if (
					!state.tweets.find(
						tweet => tweet._id === action.payload._id,
					)
				) {
					state.tweets = [action.payload, ...state.tweets];
				}
			});
	},
});

export const fetchLatest = createAsyncThunk("app/fetchLatest", async () => {
	const result = await fetchTweets();
	return result;
});

export const fetchSingle = createAsyncThunk("app/fetchTweet", async id => {
	const result = await fetchTweet(id);
	return result;
});

export const {
	addTweet,
	addComment,
	toggleLike,
	setNotis,
	readNoti,
	readAllNotis,
} = appSlice.actions;

export default appSlice.reducer;
