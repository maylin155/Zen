import { View, Pressable } from 'react-native';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const BackButton = ({ color, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 30, // Adjust size if necessary
        height: 30,
        borderRadius: 10, // Half of the width/height for perfect roundness
        justifyContent: 'center', // Center the icon vertically
        alignItems: 'center', // Center the icon horizontally
      }}
    >
      <MaterialIcons name="arrow-back-ios" size={14} color={color} />
    </Pressable>
  );
}

export default BackButton;
