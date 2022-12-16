import { 
	useMemo,
	useState,
	createContext,
} from "react";

import {
	ThemeProvider,
	createTheme,
} from "@mui/material/styles";

import {
	grey,
	pink,
	yellow,
} from "@mui/material/colors";

import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import ScrollToTop from "./Utils/ScrollToTop";

export const ColorModeContext = createContext();

export default function ThemedApp() {
	const [mode, setMode] = useState("dark");

	const colorMode = useMemo(() => {
		return ({
			toggleColorMode: () => {
				setMode((prevMode) => (
					prevMode === "light" ? "dark" : "light"
				));
			},
		})
	}, []);

	const theme = useMemo(() => {
		return createTheme({
			palette: {
				mode,
				...(mode === "light"
					? {
						banner: {
							background: grey[100]
						},
						appbar: {
							background: pink[500]
						},
						logo: {
							color: "white"
						},
						text: {
							fade: grey[500]
						},
						noti: {
							main: yellow[600],
							contrastText: yellow[400],
						}
					}
					: {
						banner: {
							background: grey[900]
						},
						appbar: {
							background: "#111"
						},
						logo: {
							color: pink[500]
						},
						text: {
							fade: grey[700]
						},
						noti: {
							main: pink[500],
							contrastText: pink[400],
						}
					}),
			},
		})
	}, [mode]);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<Router>
					<ScrollToTop />
					<App colorMode={colorMode} />
				</Router>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}
