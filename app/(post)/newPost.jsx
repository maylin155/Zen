import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Pressable, Alert} from 'react-native';
import React, {useRef, useState} from 'react';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import { supabase } from '../../lib/supabase';
import {useAuth} from '../../context/AuthContext';
import TextEditor from '../../components/TextEditor';
import { getSupabaseFileUrl } from '../../services/imageService';
import * as ImagePicker from 'expo-image-picker'
import AntDesign from '@expo/vector-icons/AntDesign';
import {Video} from 'expo-av';
import Feather from '@expo/vector-icons/Feather';
import CustomButton from '../../components/CustomButton'
import { createOrUpdatePost } from '../../services/postService';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


const newPost = () => {

  const {user} = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(false);

  const onSubmit = async () => {
    // console.log("body", bodyRef.current);
    // console.log('file: ', file);
    if(!bodyRef.current || !file){
      Alert.alert('Post', "Please choose an image or add description");
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id
    }
    //create post
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    // console.log("Post response", res);

    if(res.success){
      setFile(null);
      bodyRef.current = '';
      editorRef.current?.setContentHTML('');
      router.back();

    } else {
      Alert.alert('Post', res.msg)
    }
  }

  const isLocalFile = file => {
    if(!file) return null;
    if(typeof file == 'object') return true;
    return false;
  }

  const getFileType = file => {
    if(!file) return null;
    if (isLocalFile){
      return file.type;
    }

    //check image or video for remote file
    if(file.includes('postImage')){
      return 'image'
    }
    return 'video'

  }

  const getFileUri = file => {
    if(!file) return null;
    if(isLocalFile(file)){
      return file.uri;
    }
    return getSupabaseFileUrl(file);
  }

  const onPick = async (isImage) => {

    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    }

    if(!isImage){
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowEditing: true
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    // console.log(result.assets[0]);
    
    if(!result.canceled){
      setFile(result.assets[0]);
    }
  }



  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-4 mb-30">
        <Header title="Create Post"/>
        <ScrollView className='flex-1 gap-5 mt-3' automaticallyAdjustKeyboardInsets={true}>
          {/* avatar */}
          <View className="flex-row items-center gap-1 ">
            <Avatar
              uri={user.image}
              size={55}
              rounded={10}
            />
            <View className="gap-1">
              <Text className="text-xl">
                {user && user.name}
              </Text>
              <Text>
                Public
              </Text>

            </View>
          </View>

          {/* Text Editor */}
          <View>
            <TextEditor editorRef={editorRef} onChange={body => bodyRef.current = body} />
          </View>

          {
            file && (
              <View style={{height: 250, width: '100%', borderRadius: 18, overflow: 'hidden', borderCurve: 'continuous'}}>
                {
                  getFileType(file) === 'video' ? (
                    <Video
                    style={{flex: 1}}
                    source={{
                      uri: getFileUri(file)
                    }}
                    useNativeControls
                    resizeMode="cover"
                    isLooping
                    />

                  ):(
                    <Image source={{uri: getFileUri(file)}} resizeMode='cover' style={{flex: 1}}/>
                  )
                }
                <Pressable style={{position: 'absolute', top: 8,right: 30, backgroundColor: 'rgba(255,0,0,0.6)', borderRadius: 50, padding: 7}}>
                  <AntDesign name="delete" size={20} color="white" onPress={() => setFile(null)} />
                </Pressable>

              </View>
            )
          }

          {/* Media */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 1.5,
            padding: 12,
            paddingHorizontal: 18,
            borderRadius: 18,
            borderCurve: 'continuous',
            borderColor: '#e3e3e3'
          }}>
            <Text>Add Media</Text>

            {/* Icons Container */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Feather name="image" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Feather name="video" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
        <CustomButton
        containerStyles='h-6.2 bg-primary'
        title="Post"
        isLoading={loading}
        handlePress={onSubmit}
        />


      </View>
    </SafeAreaView>
  )
}

export default newPost