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

const PostCard = ({ item, currentUser, router, hasShadow = true, showMoreIcon = true }) => {
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);

    let bodySource = cleanHTML(item?.body);
    // console.log(item?.postLikes)

    useEffect(() => {
        const postLikes = item?.postLikes || [];
        setLikes(postLikes);
        if (postLikes.some(like => like.userId === currentUser?.id)) {
            setLiked(true); // Set liked to true if the user has already liked the post
        } else {
            setLiked(false);
        }
    }, [item?.postLikes]);

    const openPostDetails = () => {
        if (!showMoreIcon) return null;
        router.push({ pathname: 'postDetails', params: { postId: item?.id } });
    };

    const onLike = async () => {
        if (liked) {
            // User wants to unlike the post
            setLiked(false);  // Optimistically update the UI
            let updatedLikes = likes.filter(like => like.userId !== currentUser?.id);
            setLikes(updatedLikes);

            let res = await removePostLike(item?.id, currentUser?.id);
            // console.log("Remove Like:", res);
            if (!res.success) {
                Alert.alert("Post", "Something went wrong");
                setLiked(true);
                setLikes([...likes, { userId: currentUser?.id }]);
            }
        } else {
            // User wants to like the post
            setLiked(true);  // Optimistically update the UI
            let newLike = { userId: currentUser?.id, postId: item?.id };
            setLikes([...likes, newLike]);

            let res = await createPostLike(newLike);
            // console.log("Added Like:", res);
            if (!res.success) {
                Alert.alert("Post", "Something went wrong");
                setLiked(false);  // Revert the state in case of failure
                setLikes(likes.filter(like => like.userId !== currentUser?.id));  // Remove the added like in case of failure
            }
        }
    };

    const createdAt = moment(item?.created_at).format('MMM D');

    return (
        <View style={{ gap: 10, marginBottom: 15, borderRadius: 10, padding: 10, paddingVertical: 12, backgroundColor: 'white', borderWidth: 0.5, borderColor: '#dcdcdc', shadowColor: '#000', flex: 1}}> 
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
                <View className="mb-3">
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

                {/* {item?.file && item?.file.includes('postVideos') && (
                    <Video
                        style={{ height: 300, width: '100%', borderRadius: 8, borderColor: '#dcdcdc' }}
                        source={getSupabaseFileUrl(item?.file)}
                        useNativeControls
                        resizeMode="cover"
                        isLooping
                    />
                )} */}

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
                            {likes?.length}
                        </Text>
                    </View>

                    <View className="flex-row gap-2 items-center">
                        <TouchableOpacity onPress={openPostDetails}>
                            <MaterialCommunityIcons name="comment-processing-outline" size={24} color="#cdcdcd" />
                        </TouchableOpacity>

                        <Text className="text-lg font-plight text-gray-500">
                            {item?.postComments[0]?.count || 0}
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
