import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform } from "react-native";
import ChatBubble from "./ChatBubble";
import Feather from '@expo/vector-icons/Feather';
import Loading from './Loading';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {API_KEY} from '../constants';

const Chatbot = () => {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);


    // // Initial system instruction and auto-introduction
    useEffect(() => {

        const chatbotIntroduction = {
            role: "model",
            text: "Hi there! My name is Zen, and I'm a friendly mental health chatbot. I'm here to listen to you, offer support and provide information about mental health resources. Remember, if you're ever in a crisis or need immediate help, just type 'SOS' and I'll do my best to connect you with emergency services in your location. 😊 How are you doing today?"
        };

        setChat([chatbotIntroduction]);
    }, []);


    const handleUserInput = async () => {
        if (!userInput.trim()) return; 
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are a friendly mental health Chatbot named Zen. You are friendly, empathetic and also acts like a human friend. When the user uses keywords like die, suicide, SOS, and warning signs that the user needs immediate help and ask the user for location and give emergency hotline numbers based on that location."
        });

        setLoading(true);
        try {
            const result = await model.generateContent(userInput);
            const response = result.response;
            const text= response.text();

            console.log("Gemini Pro API Response:", text);

            if (text) {
                setChat([...chat, {role: "user", text: userInput},{ role: "model", text }]);
                setUserInput("");
            }
        } catch (error) {
            console.log("Error calling Gemini Pro API:", error);
            Alert.alert("An error occurred. Please try again.");
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

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={10} // Adjust as needed
        >
            <View style={{ flex: 1 }}>
                <FlatList
                    data={chat}
                    renderItem={renderChatItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 100 }} // Ensure enough space for input field
                />
            </View>

            <View style={{
                padding: 10,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                        <Loading size={22}/>
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
