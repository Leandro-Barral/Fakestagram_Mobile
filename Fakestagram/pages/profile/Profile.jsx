import React, { useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import { getUser } from "../../Services/UsersService";
import { useNavigate, useParams } from "react-router-dom";
import { getPosts } from "../../Services/PostsService";

const Profile = () => {
    const navigate = useNavigate();
    const { id: userId } = useParams();
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPostData, setNewPostData] = useState({
        imageUrl: "",
        description: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userObject = await getUser(userId);
                if (!userObject.data) {
                    console.error("Usuario no encontrado");
                    navigate("/myfeed");
                    return;
                }
                setUser(userObject.data);
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
                navigate("/error"); // Redirige a una página de error
            }
        };

        fetchUser();
    }, [userId, navigate]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) return;
            try {
                const postsObject = await getPosts();
                const filteredPosts = postsObject.data.filter((post) => post.user === user._id);
                setUserPosts(filteredPosts);
            } catch (error) {
                console.error("Error al obtener las publicaciones:", error);
            }
        };

        fetchPosts();
    }, [user]);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setNewPostData({ imageUrl: "", description: "" });
        setErrorMessage("");
        setIsModalOpen(false);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewPostData((prevData) => ({
                ...prevData,
                imageUrl: URL.createObjectURL(file),
            }));
            setErrorMessage("");
        }
    };

    const handleDescriptionChange = (event) => {
        setNewPostData((prevData) => ({
            ...prevData,
            description: event.target.value,
        }));
    };

    const handleUpload = () => {
        if (!newPostData.imageUrl) {
            setErrorMessage("Debes subir una foto antes de publicar.");
            return;
        }

        const newPost = {
            id: userPosts.length + 1,
            image: newPostData.imageUrl,
            content: newPostData.description || "Nueva publicación",
        };

        setUserPosts((prevPosts) => [newPost, ...prevPosts]); 
        closeModal();
    };

    if (!user || !userPosts) return <div>Cargando Datos...</div>;

    return (
        <div className="profile">
            <div className="profile-header">
                <img
                    src={user.profilePicture || "default-profile.png"}
                    alt="Profile"
                    className="profile-picture"
                />

                <div className="profile-info">
                    <h2>{user.name}</h2>
                    <p>@{user.username}</p>
                    <p>{user.bio}</p>
                </div>

                <div className="profile-stats">
                    <div>
                        <span>{userPosts.length}</span>
                        <p>Posts</p>
                    </div>
                    <div>
                        <span>{user.friendsCount || 0}</span>
                        <p>Friends</p>
                    </div>
                </div>

                <button className="profile-edit-button">Edit profile</button>
            </div>

            <div className="profile-posts">
                {userPosts.map((post) => (
                    <div key={post.id} className="profile-post">
                        <img src={post.image} alt="Post" className="post-image" />
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>

            <Footer onOpenModal={openModal} />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Subir una nueva publicación</h2>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {newPostData.imageUrl && (
                            <img
                                src={newPostData.imageUrl}
                                alt="Preview"
                                className="image-preview"
                            />
                        )}
                        <textarea
                            placeholder="Escribe una descripción..."
                            value={newPostData.description}
                            onChange={handleDescriptionChange}
                            className="description-box"
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button onClick={handleUpload}>Subir</button>
                        <button onClick={closeModal}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;