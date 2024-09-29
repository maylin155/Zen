import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const ChatBubble = ({ role, text }) => {
    return (
        <View style={[
            styles.chatItem,
            role === "user" ? styles.userChatItem : styles.modelChatItem
        ]}>
            <Text className="text-lg text-white">{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    chatItem: {
        marginBottom: 12,
        padding: 10,
        borderRadius: 15,
        maxWidth: "70%",
        position: "relative"
    },
    userChatItem: {
        alignSelf: "flex-end",
        backgroundColor: "#777777"
    },
    modelChatItem: {
        alignSelf: "self-start",
        backgroundColor: "#6575A8"
    },
    speakerIcon: {
        position: "absolute",
        bottom: 5,
        right: 5
    }

})

export default ChatBubble