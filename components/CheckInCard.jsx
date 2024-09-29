import { View, Text, Image } from 'react-native';
import React from 'react';
import CustomButton from '../components/CustomButton'

const CheckInCard = ({ text, image, onPress, imageStyles, buttonText }) => {
  return (
    <View className="bg-white rounded-lg p-7 my-2 shadow-md w-200 h-[220px] justify-center">
      <View className="flex-row items-center gap-1 mb-5">
        <View className="flex-1 justify-center w-1/3">
        <Text className="text-lg text-gray-800 font-pregular">{text}</Text>
        </View>
        <View className="flex-1 w-2/3">
        <Image source={image} className={`w-40 h-20 rounded-lg ${imageStyles}`} resizeMode="cover"/>
        </View>
      </View>

      <CustomButton title={buttonText} handlePress={onPress} containerStyles="bg-primary" textStyles="text-md"/>
    </View>
  );
};

export default CheckInCard;
