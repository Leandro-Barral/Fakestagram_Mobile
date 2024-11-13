import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function PostDetail() {
    const { postId } = useLocalSearchParams();

    return (
        <View>
            <Text>Detalles de la Publicación {postId}</Text>
            {/* Aquí irían los detalles de la publicación */}
        </View>
    );
}
