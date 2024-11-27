import { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { login, register } from './services/UsersService';
import React from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const defaultAuthContext = {
    user: null,
    loading: true,
    handleLogin: async () => {},
    handleRegister: async () => {},
    logout: async () => {},
};

const AuthContext = createContext(defaultAuthContext);


export function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const token = Platform.OS === 'android' 
                ? await SecureStore.getItemAsync('userToken') 
                : await AsyncStorage.getItem('userToken');
            const userId = Platform.OS === 'android' 
                ? await SecureStore.getItemAsync('userId') 
                : await AsyncStorage.getItem('userId');
            if(token && userId){
                setUser({token, userId});
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const handleLogin = async (loginData) => {
        setLoading(true);
        const result = await login(loginData);
        if (result.success) {
            setUser({ token: result.data.token, userId: result.data._id });
            router.push('/');
        } else {
            alert(result.message);
        }
        setLoading(false);
    };

    const handleRegister = async (registerData) => {
        setLoading(true);
        const result = await register(registerData);
        if (result.success) {
            setUser({ token: result.data.token, userId: result.data._id });
            router.push('/');
        } else {
            alert(result.message);
        }
        setLoading(false);
    };

    const logout = async () => {
        if(Platform.OS === 'android'){
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userId');
        }
        else{
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userId');
        }
        setUser(null);
        router.push('/'); 
    };

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        logout,
    };
}
