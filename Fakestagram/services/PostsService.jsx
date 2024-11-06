import AsyncStorage from '@react-native-async-storage/async-storage';

const URL = "http://<TU_IP_LOCAL>:3001/api/";

export const getPosts = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'Token no disponible. Por favor, inicia sesión.' };
        }

        const res = await fetch(`${URL}posts/feed`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (res.status === 401) {
            return { success: false, message: 'No autorizado. El token no es válido o ha expirado.' };
        }

        if (res.ok) {
            const posts = await res.json();
            posts.push({
                "_id": "634f1b5c8f25c32a5cd55f9b",
                "user": "67164d72b74dbed6366e3f24",
                "content": "Este es un post de ejemplo",
                "likes": ["67164d72b74dbed6366e3f24"],
                "createdAt": "2024-10-05T15:21:34.788Z",
                "image": "https://i.pinimg.com/564x/67/61/a4/6761a4439c65d86e6fa0cd5c75a3679d.jpg"
            });
            return { success: true, message: 'Posts obtenidos con éxito', data: posts };
        }

        return { success: false, message: `Error inesperado: ${res.status}` };
    } catch (error) {
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
};

export const commentPost = async (comment, postID) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'Token no disponible. Por favor, inicia sesión.' };
        }

        const JSONComment = { content: comment };

        const res = await fetch(`${URL}posts/${postID}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(JSONComment),
        });

        if (res.status === 400) {
            return { success: false, message: 'Comentario inválido.' };
        }

        if (res.status === 404) {
            return { success: false, message: 'Post no encontrado.' };
        }

        if (res.status === 201) {
            const data = await res.json();
            return { success: true, message: 'Comentario publicado exitosamente', data };
        }

        return { success: false, message: `Error inesperado: ${res.status}` };
    } catch (error) {
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
};

export const removeComment = async (commentID, postID) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'Token no disponible. Por favor, inicia sesión.' };
        }

        const res = await fetch(`${URL}posts/${postID}/comments/${commentID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (res.status === 403) {
            return { success: false, message: 'No tienes permiso para eliminar este comentario.' };
        }

        if (res.status === 404) {
            return { success: false, message: 'Post o comentario no encontrado.' };
        }

        if (res.status === 200) {
            const data = await res.json();
            return { success: true, message: 'Comentario eliminado exitosamente', data };
        }

        return { success: false, message: `Error inesperado: ${res.status}` };
    } catch (error) {
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
};

export const getComment = async (commentID) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'Token no disponible. Por favor, inicia sesión.' };
        }

        const res = await fetch(`${URL}posts/comments/${commentID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (res.status === 404) {
            return { success: false, message: 'Comentario no encontrado' };
        }

        if (res.status === 200) {
            const data = await res.json();
            return { success: true, message: 'Comentario obtenido exitosamente', data };
        }

        return { success: false, message: `Error inesperado: ${res.status}` };
    } catch (error) {
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
};

export const likePost = async (postID) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'Token no disponible. Por favor, inicia sesión.' };
        }

        const res = await fetch(`${URL}posts/${postID}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (res.status === 400) {
            return { success: false, message: 'El Usuario ya ha dado like a este post.' };
        }

        if (res.status === 404) {
            return { success: false, message: 'Post no encontrado.' };
        }

        if (res.status === 201) {
            const data = await res.json();
            return { success: true, message: 'Like agregado exitosamente', data };
        }

        return { success: false, message: `Error inesperado: ${res.status}` };
    } catch (error) {
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
};

export const removeLike = async (postID) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'Token no disponible. Por favor, inicia sesión.' };
        }

        const res = await fetch(`${URL}posts/${postID}/like`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (res.status === 400) {
            return { success: false, message: 'El Usuario no ha dado like a este post.' };
        }

        if (res.status === 404) {
            return { success: false, message: 'Post no encontrado.' };
        }

        if (res.status === 200) {
            const data = await res.json();
            return { success: true, message: 'Like eliminado exitosamente', data };
        }

        return { success: false, message: `Error inesperado: ${res.status}` };
    } catch (error) {
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
};





export const uploadPost = async (imageUri, caption) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'Token no disponible. Por favor, inicia sesión.' };
        }

        const formData = new FormData();
        formData.append('caption', caption);

        // Configuración del archivo para el backend
        const fileName = imageUri.split('/').pop();
        const fileType = imageUri.split('.').pop();

        formData.append('image', {
            uri: imageUri,
            name: fileName,
            type: `image/${fileType}`,
        });

        const res = await fetch(`${URL}posts/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        if (res.status === 201) {
            const data = await res.json();
            return { success: true, message: 'Imagen subida exitosamente', data };
        }

        return { success: false, message: `Error inesperado: ${res.status}` };
    } catch (error) {
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
};
