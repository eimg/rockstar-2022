import "../styles/globals.css";

import AuthProvider from "./components/AuthProvider";

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}
