import React, { useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import { getUser } from "../../Services/UsersService";
import { useNavigate, useParams } from "react-router-dom";
import { getPosts } from "../../Services/PostsService";

const Profile = () => {
    const navigate = useNavigate();
    const { id: userId } = useParams()
    console.log(userId);
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/'); // Redirige a la página de login
        }
    }, [navigate]);

    // Redirigir si no hay userId
    useEffect(() => {
        console.log("Voy a cargar el usuario")
        const fetchUser = async () => {
            const userObject = await getUser(userId);
            if(userObject.data == undefined){
                console.log("No se encontró el perfil")
                navigate('/myfeed');
            }
            console.log("Llegó el usuario, va a poner: " + userObject.data);
            setUser(userObject.data);
        };
        fetchUser();
    }, [userId, navigate]); 

    // Obtener los posts del usuario cuando el usuario esté disponible
    useEffect(() => {
        const fetchPosts = async () => {
            console.log("Voy a intentar cargar los posts")
            if (!user) return;
            console.log("Hay usuario, voy a hacerlo")
            const postsObject = await getPosts();
            const filteredPosts = postsObject.data.filter(post => post.user === user._id);
            console.log(filteredPosts)
            setUserPosts(filteredPosts);
        };

        fetchPosts();
    }, [user]);

    // Monitorear cambios en los posts
    useEffect(() => {
        console.log("Ahora los posts son:")
        console.log(userPosts);
    }, [userPosts]);






    // Estado para controlar el modal y los datos de la nueva publicación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPostData, setNewPostData] = useState({
        imageUrl: "",
        description: "",
    });

    const [errorMessage, setErrorMessage] = useState(""); // Para almacenar el mensaje de error

    // Función para abrir el modal
    const openModal = () => setIsModalOpen(true);

    // Función para cerrar el modal
    const closeModal = () => {
        setNewPostData({ imageUrl: "", description: "" }); // Resetea los datos
        setErrorMessage(""); // Resetea el mensaje de error
        setIsModalOpen(false);
    };

    // Función para manejar la subida de la nueva imagen
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewPostData((prevData) => ({
                ...prevData,
                imageUrl: URL.createObjectURL(file), // Mostramos la imagen localmente
            }));
            setErrorMessage(""); // Limpiar el mensaje de error si selecciona una imagen
        }
    };

    // Función para manejar el cambio de descripción
    const handleDescriptionChange = (event) => {
        setNewPostData((prevData) => ({
            ...prevData,
            description: event.target.value,
        }));
    };

    // Función para subir la nueva publicación
    const handleUpload = () => {
        // Validación: Verificar si se ha seleccionado una imagen
        if (!newPostData.imageUrl) {
            setErrorMessage("Debes subir una foto antes de publicar.");
            return;
        }

        const newPost = {
            id: user.posts.length + 1,
            imageUrl: newPostData.imageUrl,
            caption: newPostData.description || "Nueva publicación", // Si no hay descripción, usar un texto por defecto
        };

        // Actualizamos el estado del usuario agregando la nueva publicación
        setUser((prevUser) => ({
            ...prevUser,
            posts: [newPost, ...prevUser.posts], // Agregar al principio de la lista
            postsCount: prevUser.postsCount + 1, // Incrementamos el conteo de posts
        }));

        // Cerramos el modal
        closeModal();
    };

    if (userPosts == null) return <div>Cargando Datos...</div>

    return (
        <div className="profile">
            <div className="profile-header">
                <img src={user.profilePicture} alt="Profile" className="profile-picture" />

                <div className="profile-info">
                    <h2>{user.name}</h2>
                    <p>@{user.username}</p>
                    <p>{user.bio}</p>
                </div>

                <div className="profile-stats">
                    <div>
                        <span>{user.postsCount}</span>
                        <p>Posts</p>
                    </div>
                    <div>
                        <span>{user.friendsCount}</span>
                        <p>Friends</p>
                    </div>
                </div>

                <button className="profile-edit-button">Edit profile</button>
            </div>

            <div className="profile-posts">
                {userPosts.map((post) => (
                    <div key={post._id} className="profile-post">
                    <img src={post.image} alt="Post" className="post-image" />
                    {post.content}
                  </div>
                ))}
            </div>

            {/* Pasamos la función openModal al Footer */}
            <Footer onOpenModal={openModal} />

            {/* Modal de subida de imagen */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Subir una nueva publicación</h2>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {newPostData.imageUrl && (
                            <img src={newPostData.imageUrl} alt="Preview" className="image-preview" />
                        )}
                        <textarea
                            placeholder="Escribe una descripción..."
                            value={newPostData.description}
                            onChange={handleDescriptionChange}
                            className="description-box"
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Mensaje de error */}
                        <button onClick={handleUpload}>Subir</button>
                        <button onClick={closeModal}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
