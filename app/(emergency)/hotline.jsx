import { View, Text, Linking, Alert, SafeAreaView, Image, Platform } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { images } from '../../constants';
import CrisisButton from '../../components/CrisisButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Header from "../../components/Header"



const hotlines = {
  'United States': {
    name: "National Suicide Prevention Lifeline",
    number: '1-800-273-8255',
  },
  'United Kingdom': {
    name: "Samaritans",
    number: "116 123",
  },
  'Canada': {
    name: "Crisis Services Canada",
    number: "1-833-456-4566",
  },
  'Australia': {
    name: "Lifeline Australia",
    number: "13 11 14",
  },
  'India': {
    name: "Snehi Foundation",
    number: "91-22-2772-6771",
  },
  'Germany': {
    name: "Telefonseelsorge",
    number: "0800 111 0 111",
  },
  'France': {
    name: "SOS Suicide",
    number: "01 45 39 40 00",
  },
  'Japan': {
    name: "Tokyo Mental Health",
    number: "03-5774-0992",
  },
  'New Zealand': {
    name: "Lifeline New Zealand",
    number: "0800 543 354",
  },
  'South Africa': {
    name: "Suicide Crisis Helpline",
    number: "0800 567 567",
  },
  'Singapore': {
    name: "Samaritans of Singapore (SOS)",
    number: "1800-221-4444",
  },
  'Thailand' : {
    name: 'Social Assistance Center',
    number: '1300'
  }
};


const Hotline = () => {
  const { country } = useLocalSearchParams();
  const countryHotlines = hotlines[country] || {};

  const callNumber = phone => {
    console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    }
    else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-5">
        <Header />
      </View>
      <View className="flex-1 items-center bg-white justify-center">
        <View className="mb-5">
          <Image source={images.care} style={{ width: 100, height: 100, resizeMode: "contain" }} />
        </View>
        <View style={{ alignItems: 'center', maxWidth: '90%' }}>
          <Text className="font-psemibold text-2xl text-center">You are not alone</Text>
          <Text className="font-pregular text-xl mb-20 text-center">Help is available 24/7</Text>
          <Text className="font-pregular text-center text-lg">Emergency Hotline for {country}</Text>
        </View>
        <CrisisButton icon={<MaterialIcons name="call" size={24} color="#6ad63d" />} 
        title={`${countryHotlines.name}`} 
        onPress={() => callNumber(countryHotlines.number)} />

      </View>
    </SafeAreaView>
  );
};

export default Hotline;
