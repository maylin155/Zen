import { View, Text, SafeAreaView, ScrollView, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext'
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton'
import {updateUser} from '../../services/userService';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'
import { getUserImageSrc, uploadFile } from '../../services/imageService';

const EditProfile = () => {

  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({
    name: '',
    image: null,
    bio: '',
    address: ''
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        image: currentUser.image || null,
        address: currentUser.address || "",
        bio: currentUser.bio || ""
      })
    }

  }, [currentUser])

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({...user, image: result.assets[0]});
    }
    
  }

  const onSubmit = async () => {
    let userData = {...user};
    let{name, address, image, bio} = userData;
    if(!name || !address || !bio || !image){
      Alert.alert("Profile", "Please fill all the data")
      return;
    }
    setLoading(true);

    if(typeof image == 'object'){
      setUserData({...currentUser, ...userData});
      //upload image
      let imageRes = await uploadFile('profiles', image?.uri , true);
      if(imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }
    //update user
    const response = await updateUser(currentUser?.id, userData);
    setLoading(false);
    console.log("Update user result", response);

    if(response.success){
      setUserData({...currentUser, ...userData});
      router.back();
    }

  }
  let imageSource = user.image && typeof user.image === 'object' ? user.image.uri : user.image 

  // console.log("user", user.image)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, padding: 16 }}>
        <ScrollView style={{ flex: 1 }} automaticallyAdjustKeyboardInsets={true}>
          <Header title="Edit Profile" />

          {/* form */}
          <View className="items-center">
            <View className="mt-5">
              <Avatar uri={imageSource} size={120} rounded={30} />
              <Pressable className="absolute bottom-0 right-[-10px] p-1 rounded-full shadow-lg bg-white"
                style={{
                  borderRadius: 50,
                  shadowColor: '#000', // Shadow color
                  shadowOffset: { width: 0, height: 2 }, // Shadow offset
                  shadowOpacity: 0.25, // Shadow opacity
                  shadowRadius: 3.84, // Shadow radius
                  elevation: 5,
                }}
                onPress={onPickImage}
              >
                <AntDesign name="camerao" size={24} color="gray" />
              </Pressable>
            </View>


            <Text className="text-text my-5">Please fill your profile details.</Text>

            <CustomTextInput
              icon={<Feather name="user" size={24} color="black" />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={value => setUser({ ...user, name: value })}
              containerStyles="mb-3"
            />

            <CustomTextInput
              icon={<Feather name="map-pin" size={24} color="black" />}
              placeholder="Enter your address"
              value={user.address}
              onChangeText={value => setUser({ ...user, address: value })}
              containerStyles="mb-3"
            />

            <CustomTextInput
              placeholder="Enter your bio"
              value={user.bio}
              multiLine={true}
              onChangeText={value => setUser({ ...user, bio: value })}
              containerStyles="mb-3 flex-row items-start h-20 p-4"
            />

            <CustomButton title="Update" isLoading={loading} handlePress={onSubmit} containerStyles="flex-1 bg-primary w-full"/>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default EditProfile
