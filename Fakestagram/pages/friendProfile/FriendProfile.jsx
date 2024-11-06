import React, { useEffect, useState } from "react";
import './FriendProfile.css';  
import Footer from "../../Components/Footer/Footer";
import { getUser } from "../../Services/UsersService";
import { useNavigate, useParams } from "react-router-dom";

const FriendProfile = () => {
  const { friendId } = useParams(); // Obtiene el ID del amigo desde la URL
  const [friend, setFriend] = useState({});
  const [friendPosts, setFriendPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if(!friendId) {
      console.log("No se ha proporcionado un ID de amigo");
      navigate('/');
    } else {
      const fetchFriend = async () => {
        const friendObject = await getUser(friendId);
        setFriend(friendObject.data.user);
        setFriendPosts(friendObject.data.posts);
      };
      fetchFriend();
    }
  }, [friendId, navigate]);

  return (
    friend && <div className="profile">
      <div className="profile-header">
        <img src={friend.profilePicture} alt="Profile" className="profile-picture" />
        
        <div className="profile-info">
          <h2>{friend.name}</h2>
          <p>@{friend.username}</p>
          <p>{friend.bio}</p>
        </div>
        
        <div className="profile-stats">
          <div>
            <span>{friend.postsCount}</span>
            <p>Posts</p>
          </div>
          <div>
            <span>{friend.friendsCount}</span>
            <p>Friends</p>
          </div>
        </div>

        <button className="profile-edit-button">Añadir amigo</button>
      </div>

      <div className="profile-posts">
        {friendPosts.length > 0 && friendPosts.map((post) => (
          <div key={post._id} className="profile-post">
            <img src={post.image} alt="Post" className="post-image" />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

export default FriendProfile;
