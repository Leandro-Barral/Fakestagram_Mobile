import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native'; // Para notificaciones de error

const URL = "https://localhost:3001/api/";

// Interfaz para los datos de login y registro
interface AuthData {
  email: string;
  password: string;
}

// Interfaz para los datos del usuario
interface UserData {
  _id: string;
  username: string;
  email: string;
  profilePictureUrl: string;
}

// Interfaz para las respuestas de las peticiones
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Función para manejar los errores de autenticación
const handleAuthError = (error: unknown) => {
  if (error instanceof Error) {
    // Ahora TypeScript sabe que "error" es un Error y tiene propiedades como "message"
    console.error(error.message);
    Alert.alert("Error", `Hubo un problema con la autenticación: ${error.message}`);
  } else {
    // Si el error no es una instancia de Error, podemos manejarlo de otra forma
    console.error("Unknown error occurred", error);
    Alert.alert("Error", "Hubo un problema desconocido con la autenticación.");
  }
};

// Register usuario
export const register = async (registerData: AuthData): Promise<ApiResponse<UserData>> => {
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
      const data: UserData = await res.json();
      return {
        success: true,
        message: 'Registro exitoso',
        data
      };
    }

    return { success: false, message: `Error inesperado: ${res.status}` };
  } catch (error: any) {
    handleAuthError(error);
    return { success: false, message: `Error de conexión: ${error.message}` };
  }
};

// Login usuario
export const login = async (loginData: AuthData): Promise<ApiResponse<UserData>> => {
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
        // Guardar el token y el id de forma segura
        await SecureStore.setItemAsync('userToken', data.token);
        await SecureStore.setItemAsync('userId', data._id);
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
  } catch (error: any) {
    handleAuthError(error);
    return { success: false, message: `Error de conexión: ${error.message}` };
  }
};

// Obtener información del usuario
export const getUser = async (id: string): Promise<ApiResponse<UserData>> => {
  try {
    const token = await SecureStore.getItemAsync('userToken'); // Usamos SecureStore aquí

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
      const data: UserData = await res.json();
      return {
        success: true,
        message: 'Usuario obtenido con éxito',
        data
      };
    }

    return { success: false, message: `Error inesperado: ${res.status}` };
  } catch (error: any) {
    handleAuthError(error);
    return { success: false, message: `Error de conexión: ${error.message}` };
  }
};

// Actualizar datos del usuario
export const putUser = async (id: string, newData: Partial<UserData>): Promise<ApiResponse<UserData>> => {
  try {
    const token = await SecureStore.getItemAsync('userToken'); // Usamos SecureStore aquí

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
      const data: UserData = await res.json();
      return {
        success: true,
        message: 'Usuario modificado con éxito',
        data
      };
    }

    return { success: false, message: `Error inesperado: ${res.status}` };
  } catch (error: any) {
    handleAuthError(error);
    return { success: false, message: `Error de conexión: ${error.message}` };
  }
};
