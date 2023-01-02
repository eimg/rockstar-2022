import { useMemo, useState, createContext } from "react";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { grey, pink, yellow } from "@mui/material/colors";

import Header from "./Header";
import MainNav from "./MainNav";

export const ColorModeContext = createContext();

export default function Layout({ children }) {
    const [mode, setMode] = useState("dark");
    const [drawerState, setDrawerState] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setDrawerState(open);
    };

    const colorMode = useMemo(() => {
        return {
            toggleColorMode: () => {
                setMode((prevMode) =>
                    prevMode === "light" ? "dark" : "light"
                );
            },
        };
    }, []);

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode,
                ...(mode === "light"
                    ? {
                          banner: {
                              background: grey[100],
                          },
                          appbar: {
                              background: pink[500],
                          },
                          logo: {
                              color: "white",
                          },
                          text: {
                              fade: grey[500],
                          },
                          noti: {
                              main: yellow[600],
                              contrastText: yellow[400],
                          },
                      }
                    : {
                          banner: {
                              background: grey[900],
                          },
                          appbar: {
                              background: "#111",
                          },
                          logo: {
                              color: pink[500],
                          },
                          text: {
                              fade: grey[700],
                          },
                          noti: {
                              main: pink[500],
                              contrastText: pink[400],
                          },
                      }),
            },
        });
    }, [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <MainNav
                    toggleDrawer={toggleDrawer}
                    drawerState={drawerState}
                />
                <Box sx={{ ml: { lg: "280px", md: "280px" } }}>
                    <Header toggleDrawer={toggleDrawer} />
                    {children}
                </Box>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
