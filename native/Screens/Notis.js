import { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";

import {
	ListItem,
	Avatar,
	Button,
} from "@rneui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";

import { formatRelative, parseISO } from "date-fns";
import { useNavigation } from "@react-navigation/native";

import { fetchNotis, markAllNotisRead, markNotiRead } from "../apiCalls";

export default function Notis({ setNotiCount }) {
	const navigation = useNavigation();
	const [notis, setNotis] = useState([]);

	useEffect(() => {
		(async () => {
			let result = await fetchNotis();
			// handle error

			setNotis(result);
			setNotiCount(notis.filter(noti => !noti.read).length);
		})();
	}, [setNotiCount]);

	return (
		<ScrollView>
			<View
				style={{
					paddingTop: 20,
					paddingLeft: 20,
					paddingRight: 20,
					alignItems: "flex-end"
				}}
			>
				<Button
					onPress={() => {
						markAllNotisRead();

						setNotis(notis.map(noti => {
							noti.read = true;
							return noti;
						}));

						setNotiCount(0);
					}}
				>
					Mark all as read
				</Button>
			</View>

			<View style={{
				flex: 1,
				padding: 20,
				alignItems: "stretch",
				justifyContent: "flex-start",
			}}>
				{notis.map(noti => {
					return (
						<TouchableOpacity key={noti._id} onPress={() => {
							markNotiRead(noti._id);
							
							let result = notis.map(n => {
								if(n._id === noti._id) n.read = true;
								return n;
							});
							setNotis([ ...result ]);
							setNotiCount(result.filter(noti => !noti.read).length);

							navigation.navigate("Tweet", { _id: noti.target });
						}}>
							<ListItem bottomDivider style={{ opacity: noti.read ? 0.4 : 1 }}>

								{
									noti.type === "comment"
										? <Ionicons
											size={16}
											name="chatbubble"
											style={{ color: "green" }}
										/>
										: noti.type === "share"
											? <Ionicons
												size={16}
												name="share-social"
												style={{ color: "#059" }}
											/>
											: <Ionicons
												size={16}
												name="heart"
												style={{ color: "red" }}
											/>
								}

								<Avatar
									rounded
									size={32}
									title={noti.user[0].name[0].toUpperCase()}
									containerStyle={{ backgroundColor: "#05a" }}
								/>
								<ListItem.Content>
									<ListItem.Title>
										{noti.user[0].name}

										<Text style={{ marginLeft: 5, fontWeight: "normal" }}>
											{noti.msg}
										</Text>
									</ListItem.Title>
									<ListItem.Subtitle>
										<Text style={{ color: "grey" }}>
											{
												formatRelative(
													parseISO(noti.created), new Date()
												)
											}
										</Text>
									</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						</TouchableOpacity>
					)
				})}
			</View>
		</ScrollView>
	);
}
