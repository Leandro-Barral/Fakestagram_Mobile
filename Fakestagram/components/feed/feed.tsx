import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Post from '../Post/Post';
import Footer from '../Footer/Footer';
import Title from '../Title/Title';
import { getPosts } from '../../Services/PostsService';
import { useNavigation } from '@react-navigation/native';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        if (response.message === "Token no disponible. Por favor, inicia sesión.") {
          navigation.navigate('Login'); // Cambia la ruta según tu configuración
        } else {
          setPosts(response.data);
        }
      } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando publicaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title />
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.feedItem}>
            <Post
              user={item.user}
              caption={item.content}
              likes={item.likes}
              createdAt={item.createdAt}
              postId={item._id}
            />
          </View>
        )}
        ListEmptyComponent={<Text>No hay publicaciones disponibles</Text>}
        contentContainerStyle={styles.scrollablePosts}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollablePosts: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  feedItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default Feed;
