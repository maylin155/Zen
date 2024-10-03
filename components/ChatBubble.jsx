import { View, Text, StyleSheet, Animated } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const ChatBubble = ({ role, text }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    useEffect(() => {
        // Start the fade-in animation
        Animated.timing(fadeAnim, {
            toValue: 1, // Fade to opacity 1
            duration: 500, // 500ms
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    }, [fadeAnim]); // Run this effect when the component mounts

    return (
        <Animated.View // Use Animated.View instead of View
            style={[
                styles.chatItem,
                { opacity: fadeAnim }, // Bind opacity to animated value
                role === "user" ? styles.userChatItem : styles.modelChatItem,
            ]}
        >
            {role === "user" ? (
                <LinearGradient
                    colors={['#8B86B2', '#B2AECC']} // Adjust gradient colors as needed
                    style={styles.gradientBackground}
                >
                    <Text style={{color: 'white', lineHeight: 24, fontSize: 16}}>{text}</Text>
                </LinearGradient>
            ) : (
                <View style={styles.modelChatItem}>
                    <Text style={{lineHeight: 24, fontSize: 16, color: '#55575c'}}>{text}</Text>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    chatItem: {
        lineHeight: 30,
        marginBottom: 12,
        padding: 10,
        borderRadius: 15,
        maxWidth: "70%",
        position: "relative",
        shadowColor: '#a5a8a8',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    userChatItem: {
        alignSelf: "flex-end",
    },
    modelChatItem: {
        alignSelf: "flex-start",
        backgroundColor: "#fff"
    },
    gradientBackground: {
        borderRadius: 15,
        padding: 10,
    },
    textStyle: {
        color: 'white',
        fontSize: 16
    },
});

export default ChatBubble;
