import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RegisterModal from '@/components/register/Modal';
import { login } from '../../services/UsersService';

const LoginScreen = () => {
    const navigate = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    // Redireccionamiento al feed si ya está logueado
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/myfeed');
        }
    }, [navigate]);

    const handleSubmit = async () => {
        const userData = { email, password };

        const { success, message, data } = await login(userData);

        if (success) {
            console.log('Login exitoso:', data);
            navigate('/myfeed');
        } else {
            setError(message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginBox}>
                <Text style={styles.title}>Fakestagram</Text>
                <TextInput
                    style={styles.textbox}
                    placeholder="Correo Electrónico"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#ccc"
                />
                <TextInput
                    style={styles.textbox}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#ccc"
                />
                {error && <Text style={styles.errorMessage}>{error}</Text>}
                <Button title="Iniciar Sesión" onPress={handleSubmit} color="#007bff" />
                <Text style={styles.message}>
                    ¿No tienes una cuenta?{' '}
                    <Text style={styles.registerLink} onPress={() => setIsModalOpen(true)}>
                        Registrarse
                    </Text>
                </Text>
            </View>

            {/* Modal de Registro */}
            <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    loginBox: {
        backgroundColor: '#1c1e21',
        padding: 30,
        borderRadius: 10,
        width: 350,
        textAlign: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
    },
    textbox: {
        width: '100%',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#333',
        color: '#fff',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10,
    },
    message: {
        textAlign: 'center',
        marginTop: 15,
    },
    registerLink: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
