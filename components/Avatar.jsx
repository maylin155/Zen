import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { getUserImageSrc } from '../services/imageService';

const Avatar = ({uri, size = 30, rounded = 15, style={}}) => {
  return (
    <Image
    source={getUserImageSrc(uri)}
    transition={100}
    style={[styles.avatar, {height: size, width: size, borderRadius: rounded}, style]}
    />
  )
}

export default Avatar

const styles = StyleSheet.create({
    avatar: {
        borderCurve: 'continuous',
        borderColor: '#e3e3e3',
        borderWidth: 1,
    }
})