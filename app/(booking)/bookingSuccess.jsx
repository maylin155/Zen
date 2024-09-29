import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { StatusBar } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';

const BookingSuccess = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary justify-center items-center">
      <StatusBar backgroundColor="#6575A8" barStyle="light-content"/>
      <View className="items-center gap-4">
      <AntDesign name="checkcircle" size={30} color="white" />
      <Text className="font-pregular text-white text-xl">Booking Confirmed</Text>
      </View>
      <CustomButton title="Return Home" containerStyles="bg-white w-64 mt-32" textStyles="text-primary" handlePress={() => router.replace('/home')}/>
    </SafeAreaView>
  )
}

export default BookingSuccess