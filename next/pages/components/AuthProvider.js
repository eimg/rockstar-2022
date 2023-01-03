import { useState, createContext, useEffect } from 'react';

import { fetchUser } from '../../utils/apiCalls';

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
	const [authStatus, setAuthStatus] = useState(false);
	const [authUser, setAuthUser] = useState({});

	useEffect(() => {
		(async () => {
			let user = await fetchUser();
			if (!user) return false;

			setAuthUser(user);
			setAuthStatus(true);
		})();
	}, [authStatus]);

	return (
		<AuthContext.Provider
			value={{ authStatus, setAuthStatus, authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
}
