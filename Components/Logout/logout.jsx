import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { View, TouchableOpacity, Image, StyleSheet, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButton: {
        padding: 10,
        backgroundColor: 'transparent',
        borderRadius: 50,
    },
    icon: {
        width: 40,
        height: 40,
    },
});


function Logout() {
    const router = useRouter();
    
    const handleLogout = () => {
        if(Platform.OS === 'android'){
            SecureStore.deleteItemAsync("userToken");
            SecureStore.deleteItemAsync("userId");
        }
        else{
            AsyncStorage.removeItem("userToken");
            AsyncStorage.removeItem("userId");
        }        
        router.push("/");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Image
                    source={{
                        uri: 'https://static.vecteezy.com/system/resources/previews/020/839/751/non_2x/logout-icon-for-web-ui-design-vector.jpg',
                    }}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    );
}

export default Logout;
