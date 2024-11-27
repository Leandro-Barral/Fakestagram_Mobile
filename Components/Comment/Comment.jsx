/*
Objeto Comentario para Referencia:
{
  "_id": "634f1b5c8f25c32a5cd55f9b",
  "user": "634f1b2c8f25c32a5cd55f9a",
  "post": "634f1b5c8f25c32a5cd55f9c",
  "content": "Este es un comentario de ejemplo",
  "createdAt": "2024-10-05T15:21:34.788Z"
}
*/
import { getComment } from "../../services/PostsService";
import { useState, useEffect } from "react";
import { Text, View } from "react-native";

const Comment = ({ id }) => {
    const [commentData, setCommentData] = useState({});
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await getComment(id);
            console.log(id)
            const comment = response.data;
            setCommentData(comment);
            setUserData(comment.user);
        };

        fetchData();
    }, [id]);

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = [
            { label: "años", seconds: 31536000 },
            { label: "meses", seconds: 2592000 },
            { label: "días", seconds: 86400 },
            { label: "horas", seconds: 3600 },
            { label: "minutos", seconds: 60 },
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return `Hace ${count} ${interval.label}`;
            }
        }
        return "Justo ahora";
    };

    return (
        <View className={styles.commentContainer}>
            <Text className={styles.username}>{userData.username}</Text>
            <Text className={styles.commentContent}>{commentData.content}</Text>
            <Text className={styles.date}>{formatTimeAgo(commentData.createdAt)}</Text>
        </View>
    );
};

export default Comment;
