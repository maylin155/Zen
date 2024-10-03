import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import moment from 'moment';
import Feather from '@expo/vector-icons/Feather';

const JournalCard = ({ item }) => {

    const createdAtTime = moment(item?.created_at).format('h:mm A');

    return (
        <View>
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
                    <View className="flex-row gap-2 items-center">
                    <Feather name="pen-tool" size={18} color="#444343" />
                    <Text className="text-base font-psemibold tracking-widest" style={{color: '#444343'}}>Journal</Text>
                    </View>
                    <Text className="text-sm font-plight">{createdAtTime}</Text>
                </View>
                <Text className="text-sm text-gray-800 font-pregular mt-2">{item.body}</Text>
            </View>
        </View>
    );
};

export default JournalCard;
