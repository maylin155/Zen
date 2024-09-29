import { View, Text } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CustomButton from './CustomButton';
import { router } from 'expo-router';

const TherapistCard = ({ item, currentUser }) => {

  const handleBookNow = () => {
    router.push({
      pathname: '/booking',
      params: {
       therapistId: item?.id, 
       userId: currentUser?.id
      }
    });
  };

  return (
    <View className="bg-white rounded-lg p-7 my-2 shadow-xs w-200 min-h-[220px]">
      <Text className="font-pregular text-[16px] text-gray-800">{item?.name}</Text>
      <Text className="font-pregular text-[16px] text-gray-500 mt-2">{item?.specialization}</Text>
      <Text className="font-pregular text-[14px] text-gray-600 mt-8">{item?.description}</Text>
      <View className="flex-row gap-2 my-4">
        <FontAwesome name="dollar" size={18} color="#FFB627" />
        <Text className="font-pregular text-[14px] text-gray-600">{item?.price}</Text>
      </View>
      <CustomButton title="Book Now" containerStyles="bg-primary" handlePress={handleBookNow}/>
    </View>
  );
}

export default TherapistCard;
