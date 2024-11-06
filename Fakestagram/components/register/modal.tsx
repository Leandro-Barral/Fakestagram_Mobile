import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { register } from '../../services/UsersService';

const RegisterModal = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        const userData = { username, email, password };

        const { success, message, data } = await register(userData);

        if (success) {
            console.log('Registro exitoso: ' + data.username);
            handleClose();
        } else {
            setError(message);
        }
    };

    const handleClose = () => {
        onClose();
        navigation.navigate('Home'); // Cambia 'Home' a la ruta adecuada en tu app
    };

    if (!isOpen) return null;

    return (
        <Modal visible={isOpen} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Registrar Usuario</Text>
                    <View style={styles.textbox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de usuario"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>
                    <View style={styles.textbox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.textbox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo Electrónico"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>
                    {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
                    <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                        <Text style={styles.btnText}>Registrarse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 12,
        width: '80%',
        maxWidth: 400,
        alignItems: 'center',
        elevation: 5,
    },
    title: {
        color: '#333',
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    textbox: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 8,
        fontSize: 16,
    },
    btn: {
        marginTop: 20,
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    errorMessage: {
        color: 'red',
        marginTop: 10,
    },
});

export default RegisterModal;