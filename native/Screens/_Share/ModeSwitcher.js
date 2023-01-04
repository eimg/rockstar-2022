import { Button, useTheme } from "@rneui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ({ mode, setMode }) {
	const { theme, updateTheme } = useTheme();

	return (
		<>
			{mode === "dark" ? (
				<Button
					size="sm"
					type="clear"
					onPress={() => {
						setMode("light");
						updateTheme({ mode: "light" });
					}}>
					<Ionicons
						name="moon-outline"
						size={24}
						color={theme.colors.black}
					/>
				</Button>
			) : (
				<Button
					size="sm"
					type="clear"
					onPress={() => {
						setMode("dark");
						updateTheme({ mode: "dark" });
					}}>
					<Ionicons
						name="sunny-outline"
						size={24}
						color={theme.colors.warning}
					/>
				</Button>
			)}
		</>
	);
}
