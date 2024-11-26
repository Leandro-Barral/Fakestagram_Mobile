import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, Modal, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../../Services/UsersService";
import { getPosts } from "../../Services/PostsService";
import Footer from "../../Components/Footer/Footer"; // Adaptar el componente Footer a React Native
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "react-native-image-picker";

const defaultPhoto = require("../../assets/defaultpic.jpg");

const MyProfile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostData, setNewPostData] = useState({ imageUrl: "", description: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          navigation.navigate("Login");
          return;
        }

        const userResponse = await getUser(userId);
        setUser(userResponse.data.user);

        const postsResponse = await getPosts();
        const userPosts = postsResponse.data.filter((post) => post.user === userId);
        setMyPosts(userPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchError("No se pudieron cargar los datos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigation]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setNewPostData({ imageUrl: "", description: "" });
    setErrorMessage("");
    setIsModalOpen(false);
  };

  const handleImageChange = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
    });

    if (result.didCancel) {
      console.log("El usuario canceló la selección de la imagen.");
      return;
    }

    if (result.assets) {
      setNewPostData((prev) => ({
        ...prev,
        imageUrl: result.assets[0].uri,
      }));
      setErrorMessage("");
    } else {
      setErrorMessage("Error al seleccionar la imagen.");
    }
  };

  const handleDescriptionChange = (text) => {
    setNewPostData((prev) => ({ ...prev, description: text }));
  };

  const handleUpload = () => {
    if (!newPostData.imageUrl) {
      setErrorMessage("Debes subir una foto antes de publicar.");
      return;
    }

    const newPost = {
      id: myPosts.length + 1,
      imageUrl: newPostData.imageUrl,
      caption: newPostData.description || "Nueva publicación",
    };

    setMyPosts([newPost, ...myPosts]);
    closeModal();
  };

  if (isLoading) {
    return <Text style={styles.loading}>Cargando...</Text>;
  }

  if (fetchError) {
    return <Text style={styles.error}>{fetchError}</Text>;
  }

  return (
    user && (
      <View style={styles.profile}>
        <View style={styles.profileHeader}>
          <Image
            source={user.profilePicture ? { uri: user.profilePicture } : defaultPhoto}
            style={styles.profilePicture}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name || "Usuario"}</Text>
            <Text style={styles.username}>@{user.username || "Desconocido"}</Text>
            <Text style={styles.bio}>{user.bio || "Sin descripción."}</Text>
          </View>
          <View style={styles.profileStats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user.postsCount || 0}</Text>
              <Text>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user.friendsCount || 0}</Text>
              <Text>Friends</Text>
            </View>
          </View>
        </View>
        <FlatList
          data={myPosts}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
              <Text>{item.caption}</Text>
            </View>
          )}
        />
        <Footer onOpenModal={openModal} />
        <Modal visible={isModalOpen} animationType="slide">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Subir una nueva publicación</Text>
            <Button title="Seleccionar Imagen" onPress={handleImageChange} />
            {newPostData.imageUrl && (
              <Image source={{ uri: newPostData.imageUrl }} style={styles.imagePreview} />
            )}
            <TextInput
              style={styles.input}
              placeholder="Escribe una descripción..."
              value={newPostData.description}
              onChangeText={handleDescriptionChange}
            />
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            <Button title="Subir" onPress={handleUpload} />
            <Button title="Cancelar" onPress={closeModal} />
          </View>
        </Modal>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  profile: { flex: 1, padding: 16, backgroundColor: "#fff" },
  profileHeader: { alignItems: "center", marginBottom: 16 },
  profilePicture: { width: 100, height: 100, borderRadius: 50 },
  profileInfo: { alignItems: "center", marginVertical: 8 },
  name: { fontSize: 20, fontWeight: "bold" },
  username: { fontSize: 16, color: "gray" },
  bio: { textAlign: "center", marginVertical: 8 },
  profileStats: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  stat: { alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "bold" },
  post: { marginBottom: 16 },
  postImage: { width: "100%", height: 200, borderRadius: 8 },
  modalContent: { flex: 1, padding: 16, justifyContent: "center" },
  modalTitle: { fontSize: 20, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 16 },
  imagePreview: { width: "100%", height: 200, borderRadius: 8, marginVertical: 8 },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
  loading: { flex: 1, textAlign: "center", fontSize: 18, marginTop: 20 },
});

export default MyProfile;
