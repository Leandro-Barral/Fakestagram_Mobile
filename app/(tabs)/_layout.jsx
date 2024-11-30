import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Feed' }} />
            <Stack.Screen name="myprofile" options={{ title: 'Mi Perfil' }} />
        </Stack>
    );
}

