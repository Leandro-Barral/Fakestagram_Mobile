import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { login } from '../../services/UsersService';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        const userData = { email, password };
        const { success, message, data } = await login(userData);

        if (success) {
            await SecureStore.setItemAsync('auth_token', data.token);
            router.push('(tabs)');
        } else {
            setError(message);
            Alert.alert('Error', message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginBox}>
                <Text style={styles.logo}>Fakestagram</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Correo Electrónico"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Contraseña"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
                <Text style={styles.message}>
                    ¿No tienes una cuenta?{' '}
                    <Text
                        style={styles.link}
                        onPress={() => router.push('/register')}
                    >
                        Registrarse
                    </Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: 350,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    logo: {
        fontFamily: 'Billabong',
        fontSize: 48,
        color: '#333',
        marginBottom: 30,
    },
    textInput: {
        width: '100%',
        padding: 10,
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        fontSize: 14,
        backgroundColor: '#fafafa',
    },
    button: {
        width: '100%',
        padding: 10,
        backgroundColor: '#0095f6',
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    error: {
        color: '#e74c3c',
        marginTop: 10,
    },
    message: {
        marginTop: 20,
        fontSize: 14,
        color: '#000',
    },
    link: {
        fontWeight: 'bold',
        color: '#000',
        textDecorationLine: 'underline',
    },
});

export default Login;
