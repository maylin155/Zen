import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const SOSButton = ({onPress}) => {
  return (
    <View className="justify-center align-center items-center">
      <TouchableOpacity style={{backgroundColor: '#fff', padding: 10, borderRadius: 22, width: 45, height: 45, justifyContent: 'center', alignItems: 'center', elevation: 5, borderCurve: 'continuous', borderColor: '#eb4438', borderWidth: 1}} className="px-3" onPress={onPress}>
        <Text style={{fontSize: 10, color: 'red'}}>SOS</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SOSButton