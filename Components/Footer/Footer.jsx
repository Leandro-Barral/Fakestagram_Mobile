import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Logout from "../Logout/logout";

const Footer = () => {
    const router = useRouter();

    return (
        <View style={styles.footer}>
            <TouchableOpacity onPress={() => { router.push("/") }} style={styles.button}>
                <Image 
                    source={{uri: "https://cdn-icons-png.flaticon.com/512/25/25694.png"}} 
                    style={styles.icon} 
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { router.push("/myprofile") }} style={styles.button}>
                <Image 
                    source={{uri: "https://i.pinimg.com/736x/37/8a/27/378a270e775265622393da8c0527417e.jpg"}} 
                    style={styles.profilePicture} 
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton}>
                <Logout />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        zIndex: 1000,
    },
    button: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        cursor: 'pointer',
    },
    icon: {
        width: 24,
        height: 24,
        opacity: 0.7,
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#dbdbdb',
        marginRight: 30,
    },
    logoutButton: {
        position: 'relative',
        top: -5,
    },
});

export default Footer;

