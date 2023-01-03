import { useMemo, useState, createContext, useContext } from 'react';
import { Box, CssBaseline, Fab } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { grey, pink, yellow } from '@mui/material/colors';
import { AuthContext } from './AuthProvider';
import Header from './Header';
import MainNav from './MainNav';

export const ColorModeContext = createContext();

export default function Layout({ children }) {
	const router = useRouter();
	const [mode, setMode] = useState('dark');
	const [drawerState, setDrawerState] = useState(false);

	const { authStatus, authUser } = useContext(AuthContext);

	const toggleDrawer = open => event => {
		if (
			event.type === 'keydown' &&
			(event.key === 'Tab' || event.key === 'Shift')
		) {
			return;
		}

		setDrawerState(open);
	};

	const colorMode = useMemo(() => {
		return {
			toggleColorMode: () => {
				setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
			},
		};
	}, []);

	const theme = useMemo(() => {
		return createTheme({
			palette: {
				mode,
				...(mode === 'light'
					? {
							banner: {
								background: grey[100],
							},
							appbar: {
								background: pink[500],
							},
							logo: {
								color: 'white',
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
								background: '#111',
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
				<Box sx={{ ml: { lg: '280px', md: '280px' } }}>
					<Header toggleDrawer={toggleDrawer} />
					{children}

					{authStatus && router.pathname !== '/add' && (
						<Fab
							color='info'
							sx={{
								position: 'fixed',
								bottom: '40px',
								right: '40px',
							}}
							onClick={() => {
								router.push('/add');
							}}>
							<AddIcon />
						</Fab>
					)}
				</Box>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}
