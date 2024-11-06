import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const Title = () => {
    return (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>Fakestagram</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        position: 'absolute', // Similar to fixed positioning in React Native
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // Adds shadow on Android
        zIndex: 1000, // Ensures the title is above other elements
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Title;
