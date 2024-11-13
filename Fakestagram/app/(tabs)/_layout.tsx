import { Tabs } from 'expo-router';

export default function MainTabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: 'Feed' }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
            <Tabs.Screen name="upload" options={{ title: 'Upload Photo' }} />
        </Tabs>
    );
}

