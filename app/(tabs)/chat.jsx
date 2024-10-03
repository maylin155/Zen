import { SafeAreaView, Text } from 'react-native';
import React from 'react';
import Chatbot from '../../components/Chatbot';

const Chat = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white'}}>
      <Chatbot />
    </SafeAreaView>
  );
};

export default Chat;