import { Stack } from 'expo-router';

export default function UserProfileLayout() {
    return (
        <Stack>
            <Stack.Screen name="[userId]" options={{ title: 'User Profile' }} />
        </Stack>
    );
}
