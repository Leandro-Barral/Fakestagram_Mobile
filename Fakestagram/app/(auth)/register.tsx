import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useNavigation, useRouter, usePathname } from 'expo-router';
import { register } from '../../services/UsersService';

const RegisterModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        const userData = { username, email, password };

        try {
            const { success, message, data } = await register(userData);

            if (success) {
                console.log('Registro exitoso: ' + data.username);
                handleClose();
            } else {
                setError(message);
            }
        } catch (e) {
            setError('Error al registrar. Inténtalo de nuevo.');
        }
    };

    const handleClose = () => {
        onClose();
        router.push('/');
    };

    if (!isOpen) return null;

    return (
        <Modal visible={isOpen} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Registrar Usuario</Text>
                    <View style={styles.textbox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de usuario"
                            placeholderTextColor="#555"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>
                    <View style={styles.textbox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            placeholderTextColor="#555"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <View style={styles.textbox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo Electrónico"
                            placeholderTextColor="#555"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
                    <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                        <Text style={styles.btnText}>Registrarse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleClose}>
                        <Text style={styles.closeText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};






const RegisterPage = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Simula el acceso a `location.state?.openModal`
        const openModal = true; // Cambia esto para simular el estado.
        if (openModal) {
            setIsModalOpen(true);
        }
    }, []);

    return (
        <View style={styles.container}>
            <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    registerBox: {
        backgroundColor: '#fff',
        padding: 40,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        width: 340,
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    textbox: {
        marginBottom: 20,
        width: '100%',
    },
    input: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        fontSize: 16,
        color: '#555',
    },
    btn: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#ff5858',
        alignItems: 'center',
        marginTop: 15,
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeText: {
        marginTop: 20,
        fontSize: 14,
        color: '#ff5858',
        textDecorationLine: 'underline',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 12,
        width: '90%',
        maxWidth: 400,
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10, // Sombra en Android
    },
    errorMessage: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default RegisterPage;
