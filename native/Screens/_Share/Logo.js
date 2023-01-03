import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@rneui/themed';

export default function Logo() {
	const { theme } = useTheme();

	return <Ionicons name='planet' size={36} color={theme.colors.primary} />;
}
