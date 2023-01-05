import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUser } from "../apiCalls";

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: {},
		status: false,
	},
	reducers: {
		setStatus: (state, action) => {
			state.status = action.payload.status;
		},
		setUser: (state, action) => {
			state.user = action.payload.user;
		}
	},
	extraReducers: builder => {
		builder
			.addCase(checkAuth.fulfilled, (state, action) => {
				if(action.payload) {
					state.user = action.payload;
					state.status = true;
				} else {
					state.user = {};
					state.status = false;
				}
			});
	},
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
	const result = await fetchUser();
	return result;
});

export const { setStatus, setUser } = authSlice.actions;
export default authSlice.reducer;
