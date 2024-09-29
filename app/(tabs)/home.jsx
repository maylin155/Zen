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


var limit = 0;
const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);


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
    let postChannel = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostEvent)
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <View className="mx-5 flex-1">
        {/* Header */}
        <View className="flex-row justify-between my-8 items-center">
          <Text className="text-2xl font-psemibold text-gray-600">Hello, <Text className="text-primary">{user && user.name}</Text></Text>
          <Pressable onPress={() => router.push('/profile')}>
            <Avatar uri={user && user.image} size={50} rounded={30} />
          </Pressable>
        </View>

        {/* Posts */}
        <FlatList
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
