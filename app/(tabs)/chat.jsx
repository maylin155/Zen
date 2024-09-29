import { SafeAreaView, Text } from 'react-native'
import React from 'react'
import Chatbot from '../../components/Chatbot'

const Chat = () => {
  return (
    <SafeAreaView className="flex-1 mx-3">
      <Chatbot />
    </SafeAreaView>
  )
}

export default Chat