import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    Button,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    TextInput,
    Modal,
    Alert,
    Platform,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { getUser } from "../../services/UsersService";
import { getPosts, uploadPost } from "../../services/PostsService";
import * as ImagePicker from "expo-image-picker";
import { backendURL } from "../../Constants";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultPhoto = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

const MyProfile = () => {
    const router = useRouter();
    const [user, setUser] = useState({});
    const [myPosts, setMyPosts] = useState([]);
    const [file, setFile] = useState(null);
    const [newPostData, setNewPostData] = useState({ imageUrl: "", description: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchUserData = async () => { 
            if (Platform.OS === 'android') {
                const userId = await SecureStore.getItemAsync("userId");
                if (!userId) {
                    router.push("(auth)");
                } else {
                    const userObject = await getUser(userId);
                    setUser(userObject.data.user);
                    setMyPosts(userObject.data.posts);
                }
            }
            else { 
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) {
                    router.push("(auth)");
                } else {
                    const userObject = await getUser(userId);
                    setUser(userObject.data.user);
                    setMyPosts(userObject.data.posts);
                    console.log(userObject);
                }
            } 
        };
        fetchUserData();
    }, [router]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setNewPostData({ imageUrl: "", description: "" });
        setErrorMessage("");
        setIsModalOpen(false);
    };

    const handleImagePick = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert("Permiso denegado", "Se necesita acceso a la galería para continuar.");
                return;
            }
    
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
                base64: false,
            });
            console.log('Resultado de ImagePicker:', result);
            
            if (!result.canceled) {
                setNewPostData((prevData) => ({
                    ...prevData,
                    imageUrl: result.assets[0].uri,
                }));
                console.log(result);
                setFile(result.assets[0]);
            }
        } catch (error) {
            console.error("Error al abrir la galería:", error);
            Alert.alert("Error", "No se pudo abrir la galería.");
        }
    };

    const handleTakePicture = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert("Permiso denegado", "Se necesita acceso a la cámara para continuar.");
                return;
            }
    
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
                base64: false,
            });
    
            if (!result.canceled) {
                setNewPostData((prevData) => ({
                    ...prevData,
                    imageUrl: result.assets[0].uri,
                }));
                console.log(result);
                setFile(result.assets[0]);
            }
        } catch (error) {
            console.error("Error al usar la cámara:", error);
            Alert.alert("Error", "No se pudo abrir la cámara.");
        }
    };
    

    const handleUpload = async () => {
        if (!newPostData.imageUrl || !file) {
            setErrorMessage("Debes subir una foto antes de publicar.");
            return;
        }

        try {
            await uploadPost(file, newPostData.description || "Nueva publicación");
            closeModal();
        } catch (error) {
            Alert.alert("Error", "No se pudo subir la publicación.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={openModal}>
                    <Image
                        source={{ uri: "https://static-00.iconduck.com/assets.00/upload-icon-2048x2048-eu9n5hco.png" }}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <Image
                    source={{ uri: user.profilePicture ? user.profilePicture : defaultPhoto }}
                    style={styles.profilePicture}
                />
                <Text style={styles.username}>{user.username}</Text>
                <View style={styles.stats}>
                    <Text>{myPosts.length || 0} Posts</Text>
                    <Text>{user.friends?.length || 0} Friends</Text>
                </View>
            </View>

            {myPosts.length > 0 ? (
                <FlatList
                    data={myPosts}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => router.push(`posts/${item._id}`)}>
                            <Image source={{ uri: encodeURI(`${backendURL}${item.imageUrl.replace(/\\/g, '/')}`) }} style={styles.postImage} />
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text style={styles.noPostsMessage}>Todavía no has publicado nada</Text>
            )}

            {/* Modal */}
            <Modal visible={isModalOpen} animationType="slide">
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Subir una nueva publicación</Text>
                    <Button title="Buscar en Galería" onPress={handleImagePick} />
                    <Button title="Usar Cámara" onPress={handleTakePicture} />
                    {newPostData.imageUrl && (
                        <Image source={{ uri: newPostData.imageUrl }} style={styles.imagePreview} />
                    )}
                    <TextInput
                        style={styles.textInput}
                        placeholder="Escribe una descripción..."
                        value={newPostData.description}
                        onChangeText={(text) =>
                            setNewPostData((prevData) => ({ ...prevData, description: text }))
                        }
                    />
                    {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                    <Button title="Subir" onPress={handleUpload} />
                    <Button title="Cancelar" onPress={closeModal} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    header: { alignItems: "center" },
    icon: { width: 40, height: 40, marginBottom: 10 },
    profilePicture: { width: 100, height: 100, borderRadius: 50 },
    username: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
    stats: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginVertical: 10 },
    postImage: { width: 100, height: 100, margin: 5 },
    noPostsMessage: { textAlign: "center", marginTop: 20 },
    modalContent: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
    modalTitle: { fontSize: 20, marginBottom: 20 },
    imagePreview: { width: 200, height: 200, marginVertical: 20 },
    textInput: { width: "100%", borderColor: "#ccc", borderWidth: 1, padding: 10, marginVertical: 10 },
    errorMessage: { color: "red", marginTop: 10 },
});

export default MyProfile;
