import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Fontisto from '@expo/vector-icons/Fontisto';

const QuoteCard = ({ quote }) => {
    return (
        <View className="w-[350px] bg-white rounded-xl p-10 flex justify-center gap-3 mb-5 h-[310px] ml-5 mt-2">
            <View style={styles.reminder}>
                <Text className="text-white">Today's reminder</Text>
            </View>
            <Fontisto name="quote-a-right" size={24} color="#55575c" />
            <Text className="text-gray-700 font-psemibold text-3xl">{quote}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    reminder: {
        position: 'absolute',
        right: 30,
        top: 20,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#8b86b2'
    }
})

export default QuoteCard