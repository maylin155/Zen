import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const CrisisButton = ({ icon, title = "Call Hotline", onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button} // Apply styles here
      onPress={onPress}
    >
      {icon}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Button background color
    padding: 15, // Add padding for better touch area
    borderRadius: 10, // Rounded corners
    marginTop: 30, // Space above the button
    borderWidth: 1, // Add border width
    borderColor: '#e0e0e0', // Light border color
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2, // Vertical shadow
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 3, // Shadow blur
    elevation: 2, // For Android shadow effect
  },
  buttonText: {
    color: '#4a4848',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default CrisisButton;
