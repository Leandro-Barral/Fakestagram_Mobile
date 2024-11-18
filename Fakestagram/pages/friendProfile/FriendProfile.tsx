import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  FlatList, 
  Button, 
  TouchableOpacity 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; 
import { getUser } from "../../services/UsersService";

const FriendProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { friendId } = route.params; // Obtiene el ID del amigo desde las props de navegación

  const [friend, setFriend] = useState({});
  const [friendPosts, setFriendPosts] = useState([]);

  useEffect(() => {
    if (!friendId) {
      console.log("No se ha proporcionado un ID de amigo");
      navigation.navigate("Home"); // Navega a la pantalla principal
    } else {
      const fetchFriend = async () => {
        const friendObject = await getUser(friendId);
        setFriend(friendObject.data.user);
        setFriendPosts(friendObject.data.posts);
      };
      fetchFriend();
    }
  }, [friendId, navigation]);

  return (
    <View style={styles.container}>
      {friend && (
        <>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: friend.profilePicture }}
              style={styles.profilePicture}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{friend.name}</Text>
              <Text style={styles.username}>@{friend.username}</Text>
              <Text style={styles.bio}>{friend.bio}</Text>
            </View>
            <View style={styles.profileStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{friend.postsCount}</Text>
                <Text>Posts</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{friend.friendsCount}</Text>
                <Text>Friends</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Añadir amigo</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={friendPosts}
            keyExtractor={(post) => post._id}
            renderItem={({ item }) => (
              <View style={styles.post}>
                <Image source={{ uri: item.image }} style={styles.postImage} />
                <Text>{item.caption}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfo: {
    marginTop: 16,
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "#555",
  },
  bio: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  post: {
    margin: 16,
    alignItems: "center",
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
});

export default FriendProfile;
