import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
	name: "ui",
	initialState: {
		drawerState: false,
		snackbarOpen: false,
		bottomMenuState: false,
	},
	reducers: {
		setDrawerState: (state, action) => {
			state.drawerState = action.payload;
		},
		setSnackbarOpen: (state, action) => {
			state.snackbarOpen = action.payload;
		},
		setBottomMenuState: (state, action) => {
			state.bottomMenuState = action.payload;
		},
	},
});

export const { setDrawerState, setSnackbarOpen, setBottomMenuState } = uiSlice.actions;
export default uiSlice.reducer;
