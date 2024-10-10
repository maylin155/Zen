import { View, Text, SafeAreaView, FlatList, Pressable, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import Avatar from '../../components/Avatar';
import { router } from 'expo-router';
import { fetchPosts } from '../../services/postService';
import PostCard from '../../components/PostCard';
import Loading from '../../components/Loading';
import { getUserData } from '../../services/userService';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import SOSButton from '../../components/SOSButton';
import * as Location from 'expo-location';
import MoodChart from '../../components/MoodChart';
import { FetchMood } from '../../services/moodService';
import QuoteCard from '../../components/QuoteCard';
import { ScrollView } from 'react-native';
import axois from 'axios'

var limit = 0;
const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [location, setLocation] = useState(null);
  const [moodValues, setMoodValues] = useState([0,0,0,0,0,0,0]);
  const [averageMood, setAverageMood] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  

  const calculateAverageMood = (moodValues) => {

    const sum = moodValues.reduce((acc, value) => acc + value, 0);
    const average = sum / moodValues.length;
    setAverageMood(average);

    // Update motivational message based on average mood
    if (average < 2) {
      setMotivationalMessage("Feeling down? Remember, tough times never last, but tough people do.");
    } else if (average >= 2 && average < 4) {
      setMotivationalMessage("You're doing fine! Keep going, don't give up!");
    } else {
      setMotivationalMessage("Great job! Keep up the positive mood!");
    }
  };
  // console.log(averageMood);
  // console.log(motivationalMessage)

  const fetchMoodData = async () => {
    const response = await FetchMood(user?.id);
    if (response.success) {
      const updatedMoodValues = new Array(7).fill(0);

      response.data.forEach(entry => {
        const date = new Date(entry.created_at);
        const dayOfWeek = (date.getUTCDay() + 6) % 7;
        updatedMoodValues[dayOfWeek] = Math.max(updatedMoodValues[dayOfWeek], entry.moodValue);
      });
      setMoodValues(updatedMoodValues);
      calculateAverageMood(updatedMoodValues);
    }
  };

  const handlePostEvent = async (payload) => {
    if (payload.eventType === 'INSERT' && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      newPost.postComments = [{ count: 0 }];
      newPost.postLikes = [];
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  }

  const handleMoodEvent = async (payload) => {
    if (payload.eventType === 'INSERT' && payload?.new?.id) {
      // console.log(payload)
      const newMood = payload.new;
      const date = new Date(newMood.created_at);
      const dayOfWeek = (date.getUTCDay() + 6) % 7;

      setMoodValues(prevMoodValues => {
        const updatedMoodValues = [...prevMoodValues];
        updatedMoodValues[dayOfWeek] = Math.max(updatedMoodValues[dayOfWeek], newMood.moodValue);
        return updatedMoodValues;
      })
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await getPosts(true);
    setRefreshing(false);
  };

  const getPosts = async () => {

    if (!hasMore) return null;
    limit = limit + 3;
    let response = await fetchPosts(limit);
    if (response.success) {
      if (!refreshing && posts.length == response.data.length) setHasMore(false)
      setPosts(refreshing ? response.data : response.data);
    }
  };

  useEffect(() => {
    fetchMoodData();
    let postChannel = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostEvent)
      .subscribe();
    let moodChannel = supabase
      .channel('mood')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mood' }, handleMoodEvent)
      .subscribe();
    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(moodChannel);
    };
  }, []);

  const handlePress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission to access location was denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    if (reverseGeocode.length > 0) {
      const countryName = reverseGeocode[0].country;
      setLocation(countryName);

      // console.log(location);

      router.push({
        pathname: '/hotline',
        params: { country: countryName },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <View className="mx-5 flex-1">
        {/* Header */}
        <View className="flex-row justify-between my-8 items-center">
          <Text className="text-xl font-psemibold text-gray-600">Hello, <Text className="text-primary">{user && user.name}</Text></Text>
          <View className="flex-row items-center">
            <Pressable onPress={() => router.push('/profile')}>
              <Avatar uri={user && user.image} size={50} rounded={30} />
            </Pressable>
            <View className="ml-2">
              <SOSButton onPress={handlePress} />
            </View>
          </View>
        </View>


        {/* Posts */}
        <FlatList
          ListHeaderComponent={(
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10, justifyContent: 'center'}}>
              <View className="items-center flex-row align-center">
              <MoodChart moodValues={moodValues} />
              <QuoteCard quote={motivationalMessage} />
                </View> 
            </ScrollView>
          )}
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 4 }}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          onEndReached={() => {
            getPosts();
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={hasMore ?
            (<View style={{ marginVertical: posts.length === 0 ? 200 : 30 }}>
              <Loading />
            </View>) : (
              <View style={{ marginVertical: 30, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text className="text-md font-pregular">No more posts</Text>
              </View>
            )
          }
        />

        {/* Floating Plus Icon */}
        <TouchableOpacity
          onPress={() => router.push('/newPost')}
          style={{
            position: 'absolute',
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            right: -10,
            bottom: 30,
            elevation: 10, // Adds shadow effect on Android

          }}
        >
          <AntDesign name="pluscircle" size={50} color="#6575A8" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Home
