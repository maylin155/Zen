import { View, Text } from 'react-native';
import React from 'react';
import moment from 'moment';

const MoodCard = ({ item }) => {
    const createdAtTime = moment(item?.created_at).format('h:mm A');
    const moodEmojis = ['😞', '😕', '😐', '😊', '😇'];

    return (
        <View style={{
            padding: 16,
            marginBottom: 16,
            backgroundColor: 'white',
            borderRadius: 8,
            shadowColor: '#a4aabc',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5
        }}>
            <View className="flex-row justify-between">
                <View className="flex-row gap-2 items-center mb-2">
                    <Text className="text-base font-psemibold tracking-widest" style={{ color: '#444343' }}>Mood Check-In</Text>
                </View>
                <View className="flex-row gap-2">
                    <Text className="text-sm font-plight">{createdAtTime}</Text>
                </View>
            </View>
            <View className="flex-row gap-2 items-center">
                <Text>{moodEmojis[item.moodValue]}</Text>
                <Text className="font-pregular">You feel "{item.moodDetail.toLowerCase()}"</Text>
            </View>
        </View>
    );
};

export default MoodCard;
