import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTweets } from "../apiCalls";

export const appSlice = createSlice({
	name: "app",
	initialState: {
		tweets: [],
		tweet: {},
		status: "idle",
	},
	reducers: {
		setTweets: (state, action) => {
			state.tweets = action.payload.tweets;
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
			.addCase(fetchTweet.pending, state => {
				state.status = "loading";
			})
			.addCase(fetchTweet.fulfilled, (state, action) => {
				state.status = "idle";
				state.tweet = action.payload;
			});
	},
});

export const fetchLatest = createAsyncThunk(
	"app/fetchLatest",
	async () => {
		const result = await fetchTweets();
		return result;
	},
);

export const fetchTweet = createAsyncThunk("app/fetchTweet", async (id) => {
	const result = await fetchTweet(id);
	return result;
});

export const { setTweets } = appSlice.actions;
export default appSlice.reducer;
