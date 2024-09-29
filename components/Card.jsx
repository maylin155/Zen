import { View, Text, Image } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const Card = ({ title, image, buttonText }) => {
  return (
    <View className="bg-white rounded-lg shadow-lg p-3 items-center w-100">
      <Text className="text-xl text-gray-700 font-semibold mb-3">{title}</Text>
      <Image source={image} className="w-32 h-32 mb-3" resizeMode="contain" />
      <CustomButton title={buttonText} handlePress={() => router.push('/appointments')} containerStyles="bg-primary w-full"/>
    </View>
  )
}

export default Card;
