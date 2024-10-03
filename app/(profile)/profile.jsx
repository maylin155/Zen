import { View, Text, SafeAreaView, TouchableOpacity, Alert, Pressable, FlatList } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { supabase } from '../../lib/supabase';
import Avatar from '../../components/Avatar';
import Feather from '@expo/vector-icons/Feather';
import { fetchPosts } from '../../services/postService';
import Loading from '../../components/Loading';
import PostCard from '../../components/PostCard';

var limit = 0;
const Profile = () => {

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const getPosts = async () => {

    if (!hasMore) return null;
    limit = limit + 3;
    let response = await fetchPosts(limit, user.id);
    if (response.success) {
      if (posts.length == response.data.length) setHasMore(false)
      setPosts(response.data);

    }
  };


  const { user, setAuth } = useAuth();
  const onLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out", "Error signing out");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      {
        text: 'Cancel',
        onPress: () => console.log("Cancelled"),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => onLogout(),
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 4 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 1, marginHorizontal: 15 }}>
            <PostCard item={item} currentUser={user} router={router} commentCount={item.commentCount} />
          </View>
        )}

        ListHeaderComponent={<UserHeader user={user} router={router} handleLogout={handleLogout} />}
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
      // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

const UserHeader = ({ user, router, handleLogout }) => {
  return (
    <View className="bg-white p-4">
      <View>
        <Header title="Profile" />
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            position: 'absolute',
            right: 0,
            top: 2,
            borderRadius: 5,
          }}
        >
          <MaterialIcons name="logout" size={24} color="red" />
        </TouchableOpacity>

        <View>
          <View style={{ gap: 15, alignItems: 'center' }}>
            <View className="mt-5">
              <Avatar uri={user?.image} size={100} rounded={22 * 1.4} />

              <Pressable
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: -12,
                  padding: 7,
                  borderRadius: 50,
                  backgroundColor: 'white',
                  shadowColor: 'gray',
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 5,
                  shadowOpacity: 0.4,
                  elevation: 7,
                }}
                onPress={() => router.push('/editProfile')}
              >
                <Feather name="edit" size={20} color="gray" />
              </Pressable>
            </View>
          </View>

          <View>

            {/* username & address */}
            <View className="items-center gap-2 my-3">
              <Text className="text-3xl font-semibold">{user && user.name}</Text>
              {
                user && user.bio && (
                  <Text>{user.bio}</Text>
                )
              }
            </View>

            {/* email,phone and bio */}
            <View style={{ gap: 10 }}>
              <View className="flex-row gap-5 items-center">
                <Feather name="mail" size={24} color='gray' />
                <Text>{user && user.email}</Text>
              </View>

              {user && user.address && (
                <View className="flex-row gap-5 items-center">
                  <Feather name="map-pin" size={24} color="gray" />
                  <Text>{user && user.address}</Text>
                </View>
              )}


            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;
