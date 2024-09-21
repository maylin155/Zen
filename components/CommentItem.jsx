import { View, Text, Alert } from 'react-native'
import React from 'react'
import Avatar from '../components/Avatar'
import moment from 'moment'
import Entypo from '@expo/vector-icons/Entypo';
import { TouchableOpacity } from 'react-native';

const CommentItem = ({ item, canDelete = false, onDelete = () => {}}) => {
    const createdAt = moment(item?.created_at).format('MMM d')

    const handleDelete = () => {
        Alert.alert("Confirm", "Are you sure you want to delete", [
            {
              text: 'Cancel',
              onPress: () => console.log("Cancelled"),
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => onDelete(item),
              style: 'destructive',
            },
          ]);
    }
    return (
        <View className="flex-row flex-1 gap-2">
            <Avatar
                uri={item?.user?.image}
                size={45}
            />
            <View style={{ backgroundColor: 'rgba(0,0,0,0.06)', flex: 1, gap: 5, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 13, borderCurve: 'continuous' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View className="flex-row gap-1 items-center">
                        <Text className="font-psemibold text-sm">{
                            item?.user?.name
                        }

                        </Text>
                        <Text>-</Text>
                        <Text className="text-gray-500">{
                            createdAt
                        }

                        </Text>
                    </View>
                    {
                        canDelete && (
                            <TouchableOpacity onPress={handleDelete}>
                            <Entypo name="circle-with-cross" size={20} color="#eb4438" />
                        </TouchableOpacity>

                        )
                    }
                </View>
                <Text>
                    {item?.text}
                </Text>

            </View>
        </View>
    )
}

export default CommentItem