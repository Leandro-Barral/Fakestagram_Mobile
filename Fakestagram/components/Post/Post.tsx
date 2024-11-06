import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comment from "../Comment/Comment";
import { getUser } from "../../services/UsersService";
import { commentPost, getPosts, likePost } from "../../Services/PostsService";
import styles from "./post.module.css";

const Post = ({ postId }: { postId: string }) => {
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
        <div className={styles.post}>
            <div className={styles.profileInfo}>
                <img
                    src={exampleImage}
                    alt={"Foto de Perfil de " + userData.username}
                    className={styles.profileImage}
                />
                <h2 className={styles.username}>{userData.username}</h2>

                <button onClick={toggleOptions} className={styles.optionsButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <circle cx="5" cy="12" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="19" cy="12" r="2" />
                    </svg>
                </button>

                {optionsVisible && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <span className={styles.close} onClick={closeOptions}>&times;</span>
                            <button onClick={() => {/* lógica para compartir */ }} className={styles.submitButton}>Compartir</button>
                            <button onClick={() => {/* lógica para reportar */ }} className={styles.submitButton}>Reportar</button>
                        </div>
                    </div>
                )}
            </div>

            <img
                style={{ borderRadius: "8px", width: "100%", height: "100%" }}
                src={postData.image}
                alt={`Publicación ${postId}`}
                className={styles.postImage}
            />

            <div className={styles.actions}>
                <button onClick={handleLike} className={styles.actionButton}>
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

                <button onClick={() => setCommenting(!commenting)} className={styles.actionButton}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                    </svg>
                </button>
            </div>

            <p className={styles.likes}>{postData.likes.length} Likes</p>
            <p>{userData.username + " " + postData.content}</p>

            <div className={styles.commentSection}>Ver los {postData.comments?.length || 0} comentarios</div>

            {commenting && (
                <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        required
                        className={styles.commentInput}
                    />
                    <button type="submit" className={styles.submitButton}>Enviar</button>
                </form>
            )}

            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default Post;

