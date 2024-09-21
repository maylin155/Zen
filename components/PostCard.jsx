import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import moment from 'moment';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import RenderHtml from 'react-native-render-html';
import { getSupabaseFileUrl } from '../services/imageService';
import { Video } from 'expo-av';
import AntDesign from '@expo/vector-icons/AntDesign';
import { cleanHTML } from '../services/postService';
import { createPostLike, removePostLike } from '../services/postService';
import { supabase } from '../lib/supabase';

const PostCard = ({ item, currentUser, router, hasShadow = true, showMoreIcon = true}) => {
    const [liked, setLiked] = useState(false);
    const [likesArray, setLikesArray] = useState(item?.likes || []);

    let bodySource = cleanHTML(item?.body);    

    useEffect(() => {
     const userLiked = likesArray.some(like => like.userId === currentUser?.id);
        setLiked(userLiked);
    }, [likesArray, currentUser?.id]);

    const openPostDetails = () => {
        // Handle post details navigation
        if(!showMoreIcon) return null;
        router.push({pathname: 'postDetails', params: {postId: item?.id}});
    };

    const onLike = async () => {
        if (liked) {
            // User is trying to unlike the post
            setLiked(false);
            setLikesArray(likesArray.filter(like => like.userId !== currentUser?.id)); // Optimistically remove like
    
            const response = await removePostLike(item?.id, currentUser?.id);
            console.log("Remove like response: ", response); 
    
            if (!response.success) {
                // Revert the UI change if the unlike fails
                setLiked(true);
                setLikesArray([...likesArray, { userId: currentUser?.id }]);
                Alert.alert("Post", "Could not unlike the post");
            }
        } else {
            // User is trying to like the post
            setLiked(true);
            setLikesArray([...likesArray, { userId: currentUser?.id }]); // Optimistically add like
    
            const data = {
                userId: currentUser?.id,
                postId: item?.id,
            };
    
            const response = await createPostLike(data);
            console.log("Create like response: ", response); // Log response for debugging
    
            if (!response.success) {
                // Revert the UI change if the like fails
                setLiked(false);
                setLikesArray(likesArray.filter(like => like.userId !== currentUser?.id));
                Alert.alert("Post", "Could not like the post");
            }
        }
    };


    const createdAt = moment(item?.created_at).format('MMM D');
    const comments = [];  // You can replace this with actual comment data

    return (
        <View style={{ gap: 2, marginBottom: 15, borderRadius: 10, padding: 10, paddingVertical: 12, backgroundColor: 'white', borderWidth: 0.5, borderColor: '#dcdcdc', shadowColor: '#000', height: 435 }}>
            <View className="flex-row justify-between mb-3">
                <View className="flex-row items-center gap-3">
                    <Avatar uri={item?.user?.image} size={40} />
                    <View>
                        <Text className="text-lg font-pregular">{item?.user?.name}</Text>
                        <Text className="text-[12px] font-plight">{createdAt}</Text>
                    </View>
                </View>
                {
                    showMoreIcon && (
                        <TouchableOpacity onPress={openPostDetails}>
                        <MaterialCommunityIcons name="dots-horizontal" size={24} color="#55575c" />
                    </TouchableOpacity>
                    )
                }


            </View>

            <View className="flex-1">
                <View className="max-h-10">
                    {item?.body && (
                        <RenderHtml
                            contentWidth={100}
                            source={{ html: bodySource }}
                        />
                    )}
                </View>

                {item?.file && item?.file.includes('postImages') && (
                    <Image
                        source={getSupabaseFileUrl(item?.file)}
                        style={{ height: 300, width: '100%', borderRadius: 8, borderColor: '#dcdcdc', borderWidth: 1 }}
                    />
                )}

                {item?.file && item?.file.includes('postVideos') && (
                    <Video
                        style={{ height: 300, width: '100%', borderRadius: 8, borderColor: '#dcdcdc' }}
                        source={getSupabaseFileUrl(item?.file)}
                        useNativeControls
                        resizeMode="cover"
                        isLooping
                    />
                )}

                <View className="flex-row justify-between mt-4 items-center">
                    <View className="flex-row gap-2 items-center">
                        <TouchableOpacity onPress={onLike} className="mt-3">
                            <AntDesign
                                name={liked ? 'heart' : 'hearto'}
                                size={20}
                                color={liked ? '#F38DAF' : '#cdcdcd'}
                            />
                        </TouchableOpacity>

                        <Text className="text-lg font-plight text-gray-500">
                            {likesArray?.length}
                        </Text>
                    </View>

                    <View className="flex-row gap-2 items-center">
                        <TouchableOpacity onPress={openPostDetails}>
                            <MaterialCommunityIcons name="comment-processing-outline" size={24} color="#cdcdcd" />
                        </TouchableOpacity>

                        <Text className="text-lg font-plight text-gray-500">
                            {item?.postComments[0].count}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PostCard;

const styles = StyleSheet.create({
    postMedia: {
        height: 300,
        width: '100%',
        borderRadius: 8,
    },
});
