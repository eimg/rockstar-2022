import Head from 'next/head';

import Profile from '../components/Profile';

export default function User() {
	return (
		<>
			<Head>
				<title>Next Twitter</title>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<Profile />
			</main>
		</>
	);
}
