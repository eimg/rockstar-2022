import { useEffect, useState } from "react";

import { AppBar, Toolbar, IconButton, Badge } from "@mui/material";

import {
    Hub as HubIcon,
    ArrowBack as ArrowBackIcon,
    PersonSearch as PersonSearchIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

import { fetchNotis } from "../../utils/apiCalls";
import { useRouter } from "next/router";

import Search from "./Search";

export default function Header({
    auth,
    notiCount,
    setNotiCount,
    toggleDrawer,
}) {
    const router = useRouter();
    const path = router.pathname;
    const [searchOpen, setSearchOpen] = useState(false);

    // useEffect(() => {
    //     (async () => {
    //         if (auth) {
    //             let result = await fetchNotis();
    //             if (!result) return navigate("/error");

    //             setNotiCount(result.filter((noti) => !noti.read).length);
    //         }
    //     })();
    // }, [setNotiCount, auth, navigate]);

    return (
        <AppBar
            elevation={1}
            position="static"
            sx={{ bgcolor: "appbar.background" }}
        >
            <Toolbar>
                {path === "/" ? (
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2, display: { md: "none" } }}
                        onClick={toggleDrawer(true)}
                    >
                        <AccountCircleIcon />
                    </IconButton>
                ) : (
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        onClick={() => {
                            router.back();
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                )}

                <IconButton
                    disableRipple={true}
                    sx={{ flexGrow: 1, textAlign: "center" }}
                    onClick={() => {
                        router.push("/");
                    }}
                >
                    <HubIcon sx={{ color: "logo.color", fontSize: 38 }} />
                </IconButton>

                <IconButton
                    sx={{ mr: 1 }}
                    onClick={() => {
                        setSearchOpen(true);
                    }}
                >
                    <PersonSearchIcon />
                </IconButton>

                {auth && (
                    <IconButton
                        color="inherit"
                        onClick={() => {
                            router.push("/notis");
                        }}
                    >
                        {notiCount > 0 ? (
                            <Badge
                                variant="dot"
                                color="noti"
                                overlap="circular"
                            >
                                <NotificationsIcon />
                            </Badge>
                        ) : (
                            <NotificationsIcon />
                        )}
                    </IconButton>
                )}
            </Toolbar>

            <Search open={searchOpen} setOpen={setSearchOpen} />
        </AppBar>
    );
}
