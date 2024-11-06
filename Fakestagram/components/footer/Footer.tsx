import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import Logout from "../logout/logout";

interface FooterProps {
  onOpenModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  return (
    <View style={[styles.footer]}>
      <TouchableOpacity style={styles.button} onPress={() => { /* navigate to Feed */ }}>
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/25/25694.png" }} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.uploadButton} onPress={onOpenModal}>
        <Image source={{ uri: "https://static-00.iconduck.com/assets.00/camera-icon-2048x1821-0b66mmq3.png" }} style={[styles.icon, styles.uploadIcon]} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { /* navigate to Profile */ }}>
        <Image source={{ uri: "https://i.pinimg.com/736x/37/8a/27/378a270e775265622393da8c0527417e.jpg" }} style={styles.profilePicture} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.logoutButton}>
        <Logout />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e6e6e6",
    zIndex: 1000,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
    opacity: 0.7,
  },
  iconHover: {
    opacity: 1,
  },
  uploadButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIcon: {
    width: 30,
    height: 30,
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#dbdbdb",
  },
  logoutButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  desktopFooter: {
    padding: 20,
  },
});

export default Footer;
