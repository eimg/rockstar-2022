import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ThemedApp from "./ThemedApp";
import reportWebVitals from "./reportWebVitals";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import appReducer, { fetchLatest } from "./slices/appSlice";
import authReducer, { checkAuth } from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";

const store = configureStore({
	reducer: {
		app: appReducer,
		auth: authReducer,
		ui: uiReducer,
	},
});

store.dispatch(fetchLatest());
store.dispatch(checkAuth());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemedApp />
		</Provider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
