import { Stack } from 'expo-router';
//import { useAuth } from '../hooks/useAuth';

export default function RootLayout() {
    //const { isAuthenticated } = useAuth();

    return (
        <Stack>
            {false ? (
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            ) : (
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            )}
        </Stack>
    );
}
