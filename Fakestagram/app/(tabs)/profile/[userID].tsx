import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function UserProfile() {
    const { userId } = useLocalSearchParams();

    return (
        <View>
            <Text>Perfil del Usuario {userId}</Text>
            {/* Aquí irían los detalles del perfil del usuario */}
        </View>
    );
}
