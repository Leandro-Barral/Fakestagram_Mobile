import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ title, buttons }) => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.buttonsContainer}>
                {buttons.map((button, index) => (
                    <TouchableOpacity key={index} onPress={button.action}>
                        <Image
                            source={{ uri: button.image }}
                            style={styles.buttonImage}
                            accessibilityLabel={button.altText}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonImage: {
        width: 32,
        height: 32,
        marginHorizontal: 8,
    },
});

export default Header;
