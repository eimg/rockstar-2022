import { useState, useEffect } from 'react';
import { View } from 'react-native';

import { Text, Input, Button, Avatar, useTheme } from '@rneui/themed';

import { useNavigation, useRoute } from '@react-navigation/native';

import { formatRelative, parseISO } from 'date-fns';
import Toast from 'react-native-root-toast';

import { fetchTweet, postShare } from '../../apiCalls';

export default function Share({ authUser }) {
	const route = useRoute();
	const navigation = useNavigation();

	const [body, setBody] = useState('');
	const [tweet, setTweet] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	const { id } = route.params;

	const { theme } = useTheme();

	useEffect(() => {
		(async () => {
			let tweet = await fetchTweet(id);
			// handle api error here

			setTweet(tweet);
			setIsLoading(false);
		})();
	}, [id]);

	return (
		!isLoading && (
			<View style={{ padding: 10 }}>
				<View
					style={{
						marginVertical: 10,
						marginHorizontal: 10,
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}>
					<Avatar
						rounded
						size={48}
						title={authUser.name[0].toUpperCase()}
						containerStyle={{ backgroundColor: '#0a5' }}
					/>
					<Button
						onPress={() => {
							if (!body) return;

							(async () => {
								let result = await postShare(id, body);
								// handle api error here

								Toast.show('You shared a post', {
									duration: Toast.durations.LONG,
								});

								navigation.navigate('Latest');
							})();
						}}>
						Share
					</Button>
				</View>

				<View>
					<Input
						multiline={true}
						placeholder="What's on your mind?"
						onChangeText={setBody}
						value={body}
						style={{
							height: 100,
							backgroundColor: theme.colors.white,
							borderWidth: 1,
							borderColor: 'grey',
						}}
					/>
				</View>

				<View
					style={{ margin: 10, borderWidth: 1, borderColor: '#ddd' }}>
					<View
						style={{
							backgroundColor: theme.colors.fade,
							padding: 15,
							borderRadius: 4,
						}}>
						<View style={{ flexDirection: 'row' }}>
							<Avatar
								rounded
								title='O'
								size={32}
								containerStyle={{ backgroundColor: 'grey' }}
							/>
							<View style={{ marginLeft: 10, flexShrink: 1 }}>
								<View style={{ marginTop: 5 }}>
									<View
										style={{
											flexDirection: 'row',
											flexWrap: 'wrap',
										}}>
										<Text
											style={{
												fontSize: 12,
												fontWeight: 'bold',
												marginRight: 6,
											}}>
											{tweet.user[0].name}
										</Text>

										<Text
											style={{
												fontSize: 12,
												color: 'grey',
												marginRight: 10,
											}}>
											@{tweet.user[0].handle}
										</Text>

										<Text
											style={{
												fontSize: 12,
												color: '#5ad',
											}}>
											{formatRelative(
												parseISO(tweet.created),
												new Date(),
											)}
										</Text>
									</View>
								</View>

								<View style={{ marginTop: 5 }}>
									<Text style={{ fontSize: 12 }}>
										{tweet.body}
									</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</View>
		)
	);
}
