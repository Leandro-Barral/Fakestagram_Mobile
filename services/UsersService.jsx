import * as SecureStore from 'expo-secure-store';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const URL = "https://fakestagram.loca.lt/api/";



// Register usuario
export const register = async (registerData) => {
  try {
    const res = await fetch(`${URL}auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (res.status === 400) {
      return { success: false, message: 'El usuario ya existe' };
    }

    if (res.status === 201) {
      const data = await res.json();
      return {
        success: true,
        message: 'Registro exitoso',
        data
      };
    }

    return { success: false, message: `Error inesperado: ${res.status}` };
  } catch (error) {
    console.error(error.message);
    Alert.alert("Error", `Hubo un problema con la autenticación: ${error.message}`);
    return { success: false, message: `Error de conexión: ${error.message}` };
  }
};

// Login usuario
export const login = async (loginData) => {
  try {
    const res = await fetch(`${URL}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (res.status === 401) {
      return { success: false, message: 'Credenciales incorrectas' };
    }

    if (res.ok) {
      const data = await res.json();
      if (data.token && data._id) {
        if(Platform.OS === 'android'){
          await SecureStore.setItemAsync('userToken', data.token);
          await SecureStore.setItemAsync('userId', data._id);
        }
        else{
          await AsyncStorage.setItem('userToken', data.token);
          await AsyncStorage.setItem('userId', data._id);
        }
        return {
          success: true,
          message: 'Login exitoso',
          data,
        };
      } else {
        return { success: false, message: 'Login fallido' };
      }
    }

    return { success: false, message: `Error inesperado: ${res.status}` };
  } catch (error) {
    console.error(error.message);
    Alert.alert("Error", `Hubo un problema con la autenticación: ${error.message}`);
    return { success: false, message: `Error de conexión: ${error.message}` };
  }
};

// Obtener información del usuario
export const getUser = async (id) => {
  try {
    const token = Platform.OS === 'android' 
        ? await SecureStore.getItemAsync('userToken') 
        : await AsyncStorage.getItem('userToken');

    if (!token) {
      return { success: false, message: 'Token no disponible. Por favor, inicia sesión.' };
    }

    const res = await fetch(`${URL}user/profile/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.status === 404) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: 'Usuario obtenido con éxito',
        data
      };
    }

    return { success: false, message: `Error inesperado: ${res.status}` };
  } catch (error) {
    console.error(error.message);
    Alert.alert("Error", `Hubo un problema con la autenticación: ${error.message}`);
    return { success: false, message: `Error de conexión: ${error.message}` };
  }
};

// Actualizar datos del usuario
export const putUser = async (id, newData) => {
  try {
    const token = Platform.OS === 'android' 
        ? await SecureStore.getItemAsync('userToken') 
        : await AsyncStorage.getItem('userToken');

    if (!token) {
      return { success: false, message: 'Token no disponible. Por favor, inicia sesión.' };
    }

    const res = await fetch(`${URL}user/profile/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    });

    if (res.status === 400) {
      return { success: false, message: 'Datos Inválidos, envíe un nuevo username y una nueva URL para la foto de perfil que sean válidos.' };
    }

    if (res.status === 404) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (res.status === 200) {
      const data = await res.json();
      return {
        success: true,
        message: 'Usuario modificado con éxito',
        data
      };
    }

    return { success: false, message: `Error inesperado: ${res.status}` };
  } catch (error) {
    console.error(error.message);
    Alert.alert("Error", `Hubo un problema con la autenticación: ${error.message}`);
    return { success: false, message: `Error de conexión: ${error.message}` };
  }
};
