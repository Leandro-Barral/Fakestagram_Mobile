import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, Modal, TextInput, TouchableOpacity, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../../Services/UsersService";
import { getPosts } from "../../Services/PostsService";
import Footer from "../../Components/Footer/Footer"; // Adaptar el componente Footer a React Native
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para almacenamiento local
import * as ImagePicker from 'react-native-image-picker';

const defaultPhoto = require("../../assets/defaultpic.jpg");

const MyProfile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostData, setNewPostData] = useState({ imageUrl: "", description: "" });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        navigation.navigate("Login"); // Ir a la pantalla de inicio de sesión
        return;
      }

      try {
        const userResponse = await getUser(userId);
        setUser(userResponse.data.user);

        const postsResponse = await getPosts();
        const userPosts = postsResponse.data.filter((post) => post.user === userId);
        setMyPosts(userPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setNewPostData({ imageUrl: "", description: "" });
    setErrorMessage("");
    setIsModalOpen(false);
  };

  const handleImageChange = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result.assets) {
      setNewPostData((prev) => ({
        ...prev,
        imageUrl: result.assets[0].uri,
      }));
      setErrorMessage("");
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

  return (
    user && (
      <View style={styles.profile}>
        <View style={styles.profileHeader}>
          <Image
            source={user.profilePicture ? { uri: user.profilePicture } : defaultPhoto}
            style={styles.profilePicture}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>
          <View style={styles.profileStats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user.postsCount}</Text>
              <Text>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user.friendsCount}</Text>
              <Text>Friends</Text>
            </View>
          </View>
        </View>
        <FlatList
          data={myPosts}
          keyExtractor={(item) => item.id.toString()}
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
});

export default MyProfile;
