import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';


const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: ''

  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields')
    }

    const email = form.email;
    const password = form.password;
    const name = form.username;

    setIsSubmitting(true);
    const {data: {session}, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    })
    setIsSubmitting(false);

    console.log('session', session);
    console.log('error', error);

    if(error) Alert.alert(error.message)
      setIsSubmitting(false)

  }

  return (
    <SafeAreaView className="bg-background h-full">
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View className="p-3">
          <Header />
        </View>
        <View className="w-full justify-center min-h-[80vh] px-4 my-6">
          {/* <Image source={images.logo} resizeMode="contain" className="w-[115px] h-[35px]" /> */}
          <Text className="text-2xl text-black font-pregular mt-10 mb-5">
            Welcome to Zen.
          </Text>
          <Text className="text-xl text-gray-700 font-pregular mb-20">
            Please enter your details to sign up.
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton title="Sign Up" handlePress={submit} containerStyles="mt-7 bg-primary" textStyles="font-pregular tracking-widest" isLoading={isSubmitting} />

          </View>

      </ScrollView>

    </SafeAreaView>
  )
}

export default SignIn