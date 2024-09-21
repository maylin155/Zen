import { View, Text, ScrollView, Image} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants'
import CustomButton from '../components/CustomButton'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'

const App = () => {
  return (
    <SafeAreaView className="bg-background h-full">
    <StatusBar backgroundColor="#161622" style='light'/>
    <ScrollView contentContainerStyle={{paddingTop: 20}}>
      <View className="w-full justify-center items-center min-h-[85vh] px-4">
        <Image source={images.icon}
        className="w-[250px] h-[120px]"
        resizeMode="contain"
        />

        <View className="relative mt-5">
          <Text className="text-3xl text-black font-pregular text-center mb-16">
            "FIND YOUR CALM EMBRACE YOUR{' '}
            <Text className="text-primary">ZEN</Text>
            <Text>"</Text>
          </Text>
        </View>

        <CustomButton 
        title="Log In"
        handlePress={() => router.push('/sign-in')}
        containerStyles="bg-primary w-[300px] mt-7"
        textStyles="font-pregular tracking-widest"
        />

      <CustomButton 
        title="Sign Up"
        handlePress={() => router.push('/sign-up')}
        containerStyles="w-[300px] mt-3 border border-primary"
        textStyles="font-pregular tracking-widest text-primary"
        />
      </View>

    </ScrollView>
  </SafeAreaView>
  )
}

export default App