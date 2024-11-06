import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface Button {
  image: string;
  altText: string;
  action: () => void;
}

interface HeaderProps {
  title: string;
  buttons: Button[];
}

const Header: React.FC<HeaderProps> = ({ title, buttons }) => {
  return (
    <View>
      <Text>{title}</Text>
      {buttons.map((button, index) => (
        <TouchableOpacity key={index} onPress={button.action}>
          <Image source={{ uri: button.image }} alt={button.altText} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Header;