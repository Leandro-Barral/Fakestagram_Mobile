import React from 'react';
import { Button, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20, // Ajusta según tus necesidades
    },
    logoutButton: {
        padding: 10, // Espaciado para el área táctil
        backgroundColor: 'transparent', // Puede ser un color o transparente
        borderRadius: 50, // Redondea los bordes
    },
    icon: {
        width: 40, // Ajusta según el tamaño deseado
        height: 40,
    },
});


export default function Logout() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Image
                    source={{
                        uri: 'https://static.vecteezy.com/system/resources/previews/020/839/751/non_2x/logout-icon-for-web-ui-design-vector.jpg',
                    }}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    )
}
