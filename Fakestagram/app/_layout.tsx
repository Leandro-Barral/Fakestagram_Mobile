import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { AuthProvider } from '../hooks/useAuth';

export default function RootLayout() {
    const [user, setUser] = useState<String | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            /*const token = await SecureStore.getItemAsync('userToken');
            const userId = await SecureStore.getItemAsync('userId');
            if(token && userId){
                setUser({token, userId});
            }*/
            setLoading(false);
        };
        checkUser();
    }, []);

    if (loading) return null; // Falta añadir algo para la carga.

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
