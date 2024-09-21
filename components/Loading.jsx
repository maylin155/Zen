import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const Loading = ({size="large", color="#6575A8"}) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

export default Loading