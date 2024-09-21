import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import moment from 'moment';

const JournalCard = ({ item, currentUser }) => {
    // Format the date and day of the week
    const createdAtDate = moment(item?.created_at).format('MMM D');
    const createdAtDay = moment(item?.created_at).format('dddd'); 
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
                    elevation: 5}}>
                <Text className="text-sm font-plight">{createdAtTime}</Text>
                <Text className="text-lg text-gray-800 font-pregular">{item.body}</Text>
            </View>
        </View>
    );
};

export default JournalCard;
