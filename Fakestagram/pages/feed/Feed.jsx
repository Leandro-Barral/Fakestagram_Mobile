import React, { useState, useEffect } from 'react';
import Post from '../../Components/Post/Post';
import { getPosts } from '../../Services/PostsService';
import styles from './feed.module.css';
import FooterWeb from '../../Components/Footer/FooterWeb';
import { useNavigate } from 'react-router-dom';
import Title from '../../Components/Title/title';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        if (response.message === "Token no disponible. Por favor, inicia sesión.") {
          navigate('/');
        }
        console.log(response);
        setPosts(response.data);
      } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Cargando publicaciones...</div>;
  }

  return (
    <div className={styles['feed-container']}>
      <FooterWeb /> {/* Se coloca a la izquierda debido al layout flex */}
      <div className={styles['feed-content']}>
        {posts.length === 0 ? (
          <div>No hay publicaciones disponibles</div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className={styles['feed-item']}>
              <Post
                user={post.user}
                caption={post.content}
                likes={post.likes}
                createdAt={post.createdAt}
                postId={post._id}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
