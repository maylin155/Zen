import { View, Text } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import dayjs from 'dayjs';
import { TouchableOpacity } from 'react-native';
import { removeBooking } from '../services/bookingService';

const BookingCard = ({ item, currentUser, onBookingDeleted }) => {

  return (
    <View className="border rounded-lg p-5" style={{ position: 'relative' }}>
      {/* Top section with therapist name, arrows, and 'You' */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text className="font-psemibold text-[18px] text-gray-800">{item?.therapist?.name}</Text>
        <AntDesign name="left" size={20} color="#484747" style={{ marginHorizontal: 8 }} />
        <AntDesign name="right" size={20} color="#484747" />
        <Text className="font-psemibold text-[18px] ml-2 text-gray-800">You</Text>
      </View>

      {/* Close square icon in the top right corner */}
      <TouchableOpacity style={{ position: 'absolute', top: 22, right: 10 }} onPress={() => onBookingDeleted(item)}>
        <AntDesign name="closecircle" size={20} color="#eb4438" />
      </TouchableOpacity>

      {/* Date section */}
      <View className="flex-row items-center mt-3">
        <AntDesign name="calendar" size={20} color="#484747" />
        <Text className="ml-2">{dayjs(item?.date).format('DD-MM-YYYY')}</Text>
      </View>

      {/* Time section */}
      <View className="flex-row items-center mt-3">
        <AntDesign name="clockcircleo" size={20} color="#484747" />
        <Text className="ml-2">{item.time}</Text>
      </View>
    </View>
  );
}

export default BookingCard;