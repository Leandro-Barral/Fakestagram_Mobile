import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "@/services/UsersService";
import { commentPost, getPosts, likePost } from "../../Services/PostsService";
import { StyleSheet } from "react-native";

const Post = ({ postId }) => {
    // Verificar si el componente se está utilizando con un parámetro de URL
    if (window.location.href.startsWith("http://localhost:5173/posts/")) {
        const { id } = useParams();
        if (id) postId = id;
    }

    const [postData, setPostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [newComment, setNewComment] = useState('');  // Estado para el nuevo comentario
    const [liked, setLiked] = useState(false);
    const [commenting, setCommenting] = useState(false);
    const [error, setError] = useState('');
    const [optionsVisible, setOptionsVisible] = useState(false);
    const exampleImage = "https://i.pinimg.com/736x/37/8a/27/378a270e775265622393da8c0527417e.jpg";

    useEffect(() => {
        if (!postId) return; // Si no hay postId, no ejecuta la función

        // Función para obtener datos del post y usuario asociado
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getPosts();
                if (response.data) {
                    const post = response.data.find(post => post._id === postId);
                    if (post) {
                        setPostData(post);
                        const userResponse = await getUser(post.user);
                        if (userResponse) setUserData(userResponse);
                    } else {
                        setError("Publicación no encontrada");
                    }
                }
            } catch (err) {
                setError("Error al cargar la publicación");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [postId]);

    // Manejar el botón de "Me gusta"
    const handleLike = async () => {
        try {
            const response = await likePost(postId);
            if (response.success) {
                setLiked(!liked);
            } else {
                setError(response.message || "Error al dar 'Me gusta'");
            }
        } catch (err) {
            setError("Error al dar 'Me gusta'");
        }
    };

    // Manejar el envío de comentarios
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const result = await commentPost(newComment, postId);
        if (result.success) {
            setNewComment(''); // Limpiar el campo de comentario después de enviar
            setCommenting(false);
            // Agregar el nuevo comentario a la lista de comentarios del post
            setPostData((prevData) => ({
                ...prevData,
                comments: [...(prevData.comments || []), result.data]
            }));
        } else {
            setError(result.message);
        }
    };

    const toggleOptions = () => {
        setOptionsVisible(!optionsVisible);
    };

    const closeOptions = () => {
        setOptionsVisible(false);
    };

    if (loading) return <div>Cargando Datos...</div>;
    if (error) return <div>{error}</div>;
    if (!postData || !userData) return <div>No se pudo encontrar la publicación :C</div>;


    

    return (
        <div style={styles.post}>
            <div style={styles.profileInfo}>
                <img
                    src={exampleImage}
                    alt={"Foto de Perfil de " + userData.username}
                    style={styles.profileImage}
                />
                <h2 style={styles.username}>{userData.username}</h2>

                <button onClick={toggleOptions} style={styles.optionsButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <circle cx="5" cy="12" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="19" cy="12" r="2" />
                    </svg>
                </button>

                {optionsVisible && (
                    <div style={styles.modal}>
                        <div style={styles.modalContent}>
                            <span style={styles.close} onClick={closeOptions}>&times;</span>
                            <button onClick={() => {/* lógica para compartir */ }} style={styles.submitButton}>Compartir</button>
                            <button onClick={() => {/* lógica para reportar */ }} style={styles.submitButton}>Reportar</button>
                        </div>
                    </div>
                )}
            </div>

            <img
                style={{ borderRadius: "8px", width: "100%", height: "100%" }}
                src={postData.image}
                alt={`Publicación ${postId}`}
            />

            <div style={styles.actions}>
                <button onClick={handleLike} style={styles.actionButton}>
                    {liked ? (
                        <svg width="24" height="24" fill="red" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    )}
                </button>

                <button onClick={() => setCommenting(!commenting)} style={styles.actionButton}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                    </svg>
                </button>
            </div>

            <p style={styles.likes}>{postData.likes.length} Likes</p>
            <p>{userData.username + " " + postData.content}</p>

            <div style={styles.commentSection}>Ver los {postData.comments?.length || 0} comentarios</div>

            {commenting && (
                <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        required
                        style={styles.commentInput}
                    />
                    <button type="submit" style={styles.submitButton}>Enviar</button>
                </form>
            )}

            {error && <p style={styles.errorMessage}>{error}</p>}
        </div>
    );
};


const styles = StyleSheet.create({
  post: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxWidth: 400,
    marginHorizontal: 'auto', // React Native doesn't have 'auto' margin, so use this to center
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    fontFamily: 'Arial', // Note: You might need to import custom fonts in your project
    color: '#4a4a4a',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 'auto',
    marginTop: 10,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'pointer', // React Native doesn't use cursor, so this won't have effect
    padding: 4,
    color: '#4a4a4a',
  },
  commentSection: {
    color: 'grey',
    marginTop: 8,
  },
  errorMessage: {
    color: 'red',
  },
  commentForm: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  commentInput: {
    flexGrow: 1,
    padding: 6,
    borderWidth: 1,
    borderColor: '#4a4a4a',
    borderRadius: 4,
    backgroundColor: '#fff',
    color: '#4a4a4a',
  },
  submitButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#4a4a4a',
    borderWidth: 1,
    borderColor: '#4a4a4a',
    borderRadius: 4,
    cursor: 'pointer',
    marginLeft: 8,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1000,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: 'relative',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    cursor: 'pointer', // React Native doesn't use cursor
    fontSize: 24,
  },
  optionsButton: {
    backgroundColor: 'transparent',
  },
  likes: {
    textAlign: 'left',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: -3,
    marginLeft: 5,
  },
});


export default Post;

