import { Stack } from 'expo-router';
import { useAuth, AuthProvider } from '../hooks/useAuth';

export default function RootLayout() {
    const {user, loading} = useAuth();

    if (loading) return null;

    return (
        <AuthProvider>
                <Stack>
                {user ? (
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                ) : (
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                )}
            </Stack>
        </AuthProvider>  
    );
}
