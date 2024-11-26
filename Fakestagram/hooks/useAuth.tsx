import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { login, register } from '../services/UsersService';
import React from 'react';

// Definir los tipos para el contexto de autenticación
interface AuthContextType {
    user: { token: string | null; userId: string | null } | null;
    loading: boolean;
    handleLogin: (loginData: { username: string; password: string }) => Promise<void>;
    handleRegister: (registerData: { username: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
    user: null,
    loading: true,
    handleLogin: async () => {},
    handleRegister: async () => {},
    logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
    const [user, setUser] = useState<{ token: string | null; userId: string | null } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            /*const token = await SecureStore.getItemAsync('userToken');
            const userId = await SecureStore.getItemAsync('userId');
            if(token && userId){
                setUser({token, userId});
            }*/
            setLoading(false);
        };
        checkUser();
    }, []);

    const handleLogin = async (loginData: { username: string; password: string }) => {
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

    const handleRegister = async (registerData: { username: string; password: string }) => {
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
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userId');
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
