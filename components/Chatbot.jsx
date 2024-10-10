import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform, Animated, Easing } from "react-native";
import ChatBubble from "./ChatBubble";
import Feather from '@expo/vector-icons/Feather';
import Loading from './Loading';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from '../constants';

const Chatbot = () => {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false); // New state for chatbot typing
    const typingAnimation = useRef(new Animated.Value(0)).current; // Animation value
    const flatListRef = useRef(null); // Ref for FlatList

    useEffect(() => {
        const chatbotIntroduction = {
            role: "model",
            text: "Hi there! My name is Zen, and I'm a friendly mental health chatbot. I'm here to listen to you, offer support and provide information about mental health resources. Remember, if you're ever in a crisis or need immediate help, just type 'SOS' and I'll do my best to connect you with emergency services in your location. 😊 How are you doing today?"
        };
        setChat([chatbotIntroduction]);
    }, []);

    useEffect(() => {
        // Automatically scroll down after chat updates
        if (chat.length > 0 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current.scrollToEnd();
            }, 100); // Delay to ensure the content has been rendered
        }
    }, [chat]);

    useEffect(() => {
        if (isTyping) {
            startTypingAnimation();
        } else {
            typingAnimation.setValue(0); // Reset animation when typing ends
        }
    }, [isTyping]);

    const startTypingAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(typingAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
                Animated.timing(typingAnimation, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
            ])
        ).start();
    };

    const handleUserInput = async () => {
        if (!userInput.trim()) return;

        // Add user message to chat
        setChat([...chat, { role: "user", text: userInput }]);
        setUserInput("");
        setIsTyping(true); // Set chatbot typing to true

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are a friendly mental health Chatbot named Zen. You are friendly, empathetic and also act like a human friend. When the user uses keywords like die, suicide, SOS, and warning signs, you ask the user for their location and provide emergency hotline numbers based on that location."
        });

        setLoading(true);

        try {
            // Simulate chatbot typing delay
            setTimeout(async () => {
                const result = await model.generateContent(userInput);
                const response = result.response;
                const text = response.text();

                console.log("Gemini Pro API Response:", text);

                if (text) {
                    // Add chatbot response to chat
                    setChat((prevChat) => [...prevChat, { role: "model", text }]);
                }

                setIsTyping(false); // Stop typing indicator
            }, 2000); // Delay for 2 seconds to simulate typing
        } catch (error) {
            console.log("Error calling Gemini Pro API:", error);
            Alert.alert("An error occurred. Please try again.");
            setIsTyping(false); // Stop typing on error
        } finally {
            setLoading(false);
        }
    };

    const renderChatItem = ({ item }) => (
        <ChatBubble
            role={item.role}
            text={item.text}
        />
    );

    const TypingIndicator = () => {
        const opacity = typingAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1], // Pulsing effect
        });

        return (
            <Animated.View style={{ opacity }}>
                <ChatBubble
                    role="model"
                    text=" . . . "
                />
            </Animated.View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, paddingHorizontal: 20 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={10}
        >
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={flatListRef}
                    showsVerticalScrollIndicator={false}
                    data={chat}
                    renderItem={renderChatItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    onContentSizeChange={() => flatListRef.current.scrollToEnd()}
                    onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
                />
                {isTyping && ( // Show typing indicator with animation when chatbot is generating a reply
                    <View style={{ marginBottom: 10 }}>
                        <TypingIndicator />
                    </View>
                )}
            </View>

            <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7 }}>
                    <TextInput
                        style={{
                            flex: 1,
                            height: 50,
                            marginRight: 10,
                            paddingHorizontal: 10,
                            borderWidth: 1,
                            borderColor: "#ddd",
                            borderRadius: 25,
                        }}
                        placeholder="Type your message..."
                        placeholderTextColor="#aaa"
                        value={userInput}
                        onChangeText={setUserInput}
                    />
                    {loading ? (
                        <Loading size={22} />
                    ) : (
                        <TouchableOpacity onPress={handleUserInput}>
                            <Feather name="send" size={22} color="#8b86b2" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Chatbot;
