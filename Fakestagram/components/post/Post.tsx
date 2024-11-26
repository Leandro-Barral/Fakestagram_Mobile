import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getUser } from "../../services/UsersService";
import { commentPost, removeLike, getPosts, likePost } from "../../services/PostsService";
import React from "react";

const styles = StyleSheet.create({
    post: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginVertical: 8, // Lo añado del segundo conjunto, para separar posts
        maxWidth: 400,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        fontFamily: "Arial",
        color: "#4a4a4a",
    },
    profileInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        width: "100%",
        justifyContent: "space-between",
        marginBottom: 8, // Añadido para mejor separación visual
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8, // Añadido para separación de imagen y texto
    },
    username: {
        fontSize: 18,
        fontWeight: "bold",
    },
    postImage: {
        width: "100%",
        height: 200,
        marginTop: 10,
        borderRadius: 8,
    },
    actions: {
        flexDirection: "row",
        marginTop: 8,
    },
    actionButton: {
        padding: 4,
        color: "#4a4a4a",
        marginRight: 16, // Añadido para separar botones
    },
    commentSection: {
        color: "grey",
        marginTop: 8,
    },
    errorMessage: {
        color: "red",
        marginTop: 8, // Añadido para mantener consistencia
    },
    commentForm: {
        flexDirection: "row",
        gap: 8,
        marginTop: 10,
    },
    commentInput: {
        flex: 1,
        padding: 6,
        borderWidth: 1,
        borderColor: "#4a4a4a",
        borderRadius: 4,
        backgroundColor: "#fff",
        color: "#4a4a4a",
    },
    submitButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#fff",
        borderColor: "#4a4a4a",
        borderWidth: 1,
        borderRadius: 4,
        marginLeft: 8,
    },
    modal: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: 1000,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    close: {
        position: "absolute",
        top: 10,
        right: 10,
        fontSize: 24,
    },
    optionsButton: {
        backgroundColor: "transparent",
    },
    likes: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: -3,
        marginLeft: 5,
    },
    loader: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
    }
});


const Post = ({ postId, publisher, caption, likes, createdAt, imageUrl, comments }: any) => {
    const route = useRoute();
    const navigation = useNavigation();

    const [postData, setPostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [liked, setLiked] = useState(false);
    const [commenting, setCommenting] = useState(false);
    const [error, setError] = useState("");
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const postIdFromRoute = route.params?.postId;
        const id = postIdFromRoute || postId;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getPosts();
                const post = response.data.find((post: any) => post._id === id);
                if (post) {
                    setPostData(post);
                } else {
                    setError("Publicación no encontrada");
                }
            } catch (err) {
                setError("Error al cargar la publicación");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [route.params?.postId]);

    useEffect(() => {
        if (postData) {
            const userId = "currentUserId"; // Reemplaza con la lógica para obtener el ID del usuario actual
            setLiked(postData.likes.includes(userId));
        }
    }, [postData]);

    const handleLike = async () => {
        try {
            const userId = "currentUserId"; // Reemplaza con la lógica para obtener el ID del usuario actual
            const response = liked
                ? await removeLike(postData._id)
                : await likePost(postData._id);

            if (response.success) {
                setLiked(!liked);
                setPostData((prevData: any) => ({
                    ...prevData,
                    likes: liked
                        ? prevData.likes.filter((id: any) => id !== userId)
                        : [...prevData.likes, userId],
                }));
            } else {
                setError(response.message || "Error al actualizar 'Me gusta'");
            }
        } catch (err) {
            setError("Error al actualizar 'Me gusta'");
        }
    };

    const handleCommentSubmit = async () => {
        try {
            const result = await commentPost(newComment, postData._id);
            if (result.success) {
                setNewComment("");
                setCommenting(false);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Error al enviar comentario");
        }
    };

    if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
    if (error) return <Text style={styles.errorMessage}>{error}</Text>;
    if (!postData) return <Text style={styles.errorMessage}>Publicación no encontrada</Text>;

    return ( 
        <View style={styles.post}>
            <View style={styles.profileInfo}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile", { userId: postData.publisher._id })}>
                    <Image
                        source={{ uri: postData.publisher.profilePicture || defaultPhoto }}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <Text style={styles.username} onPress={() => navigation.navigate("Profile", { userId: postData.publisher._id })}>
                    {postData.publisher.username}
                </Text>
            </View>
    
            <Image source={{ uri: postData.imageUrl }} style={styles.postImage} />
    
            <View style={styles.actions}>
                <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
                    <Text>{liked ? "💖" : "🤍"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCommenting(!commenting)} style={styles.actionButton}>
                    <Text>💬</Text>
                </TouchableOpacity>
            </View>
    
            <Text style={styles.likes}>{postData.likes.length} Likes</Text>
            <Text>
                <Text style={styles.username}>{postData.publisher.username} </Text>
                {postData.caption}
            </Text>
    
            <TouchableOpacity onPress={() => setShowComments(!showComments)}>
                <Text style={styles.commentSection}>
                    {showComments ? "Ocultar comentarios" : `Ver comentarios (${postData.comments?.length || 0})`}
                </Text>
            </TouchableOpacity>
    
            {showComments && (
                <FlatList
                    data={postData.comments}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <Text>{item.text}</Text>}
                />
            )}
    
            {commenting && (
                <View style={styles.commentForm}>
                    <TextInput
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Escribe un comentario..."
                        style={styles.commentInput}
                    />
                    <TouchableOpacity onPress={handleCommentSubmit} style={styles.submitButton}>
                        <Text>Enviar</Text>
                    </TouchableOpacity>
                </View>
            )}
    
            {error && <Text style={styles.errorMessage}>{error}</Text>}
        </View>
    );
    
};

export default Post;
