import { View, Text } from 'react-native'
import React from 'react'
import BackButton from './BackButton'
import { router } from 'expo-router'

const Header = ({title, showBackButton = true, mb=10}) => {
  return (
    <View className={`flex-row justify-center items-center mb-${mb} gap-5`}>
      {
        showBackButton && (
            <View style={{position: 'absolute', left: 0, top: 1}}>
                <BackButton color="#6575A8" onPress={() => router.back()} />
            </View>
        )
      }
      <Text className="text-xl font-semibold text-textDark">{title || ""}</Text>
    </View>
  )
}

export default Header