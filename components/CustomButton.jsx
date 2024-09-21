import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7} className={`rounded-xl min-h-[55px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}>
            <Text className={`text-white font-psemibold text-lg ${textStyles}`}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton