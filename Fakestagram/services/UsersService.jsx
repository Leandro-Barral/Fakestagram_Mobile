const URL = "http://localhost:3001/api/";

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
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
};






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
            console.log(data);
            //Manejo de Token con Local Storage
            if (data.token && data._id) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data._id);
                return {
                    success: true,
                    message: 'Login exitoso',
                    data,
                };
            } else {
                return { 
                    success: false, 
                    message: 'Login fallido' 
                };
            }
        }

        return { success: false, message: `Error inesperado: ${res.status}` };
    } catch (error) {
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
};



export const getUser = async (id) => {
    try {
        const token = localStorage.getItem('token');

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
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
};



export const putUser = async (id, newData) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return { success: false, message: 'Token no disponible. Por favor, inicia sesión.' };
        }

        const res = await fetch(`${URL}user/profile/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newData)
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
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
}