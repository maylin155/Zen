import { View, Text, ScrollView, Alert} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { fetchPostDetails, removeComment } from '../../services/postService'
import PostCard from '../../components/PostCard'
import { useAuth } from '../../context/AuthContext'
import { router } from 'expo-router'
import Loading from '../../components/Loading'
import { createComment } from '../../services/postService'
import CommentInput from '../../components/CommentInput'
import CommentItem from '../../components/CommentItem';
import { supabase } from '../../lib/supabase'

const PostDetails = () => {
  const {postId} = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const {user} = useAuth();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef(null);

  const handleNewComment = async (payload) => {
    console.log("Got new comment", payload);
    if(payload.new){
      let newComment = {...payload.new};
      let res = await getUserData(newComment.userId);
      newComment.user = res.success? res.data: {};
      setPost(prevPost => {
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments]
        }
      })
    }
  }


  const onNewComment = async () => {
    if(!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current
    }

    let res = await createComment(data);
    if (res.success){
      inputRef.current.clear();
      commentRef.current = "";

      await getPostDetails();
    } else {
      Alert.alert("Comment", res.msg)
    }

  }

  const onDeleteCurrent = async (comment) => {
    console.log("Deleting current", comment);
    let response = await removeComment(comment?.id)

    if(response.success){
      setPost(prevPost => {
        let updatedPost = {...prevPost};
        updatedPost.postComments = updatedPost.postComments.filter(c => c.id != comment.id)
        return updatedPost;
      })

    } else {
      Alert.alert("Comment", response.msg)
    }

  }

  useEffect(() => {
    getPostDetails();
    let commentChannel = supabase
      .channel('postComments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'postComments', filter: `postId=eq${postId}`}, handleNewComment)
      .subscribe(); 
    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, [])

  const getPostDetails = async () => {
    //fetch post details here
    let response = await fetchPostDetails(postId);
    if(response.success){
      setPost(response.data);
      setStartLoading(false);
    }

    if(startLoading){
      return (
        <View className="flex-1 items-center justify-center">
          <Loading />
        </View>
      )
    }

    if(!post){
      return (
        <View className="items-center justify-start mt-[100px]">
          <Text className="text-lg font-pregular">
            Post not found
          </Text>
        </View>
      )
    }

    }
  return (
    <View className="flex-1 bg-white">
    <ScrollView showsVerticalScrollIndicator={false} className="p-4" automaticallyAdjustKeyboardInsets={true}>
      <PostCard
      item={{...post, postComments: [{count: post?.postComments?.length}]}}
      currentUser={user}
      router={router}
      hasShadow={false}
      showMoreIcon = {false}
      />

      {/* comment input */}
      <View className="flex-row items-center">
        <CommentInput
        inputRef = {inputRef}
        placeholder="Type comment ..."
        placeholderTextColor = "#cdcdcd"
        containerStyles={{borderRadius: 18, flex: 1}}
        onChangeText={value => commentRef.current = value}
        activeColor='#55575c'
        setIcon={true}
        onPress={onNewComment}
        />
      </View>

      {/* comment list */}
      <View style={{marginVertical: 15, gap: 17}}>
        {
          post?.postComments?.map(comment =>
            <CommentItem
            item={comment}
            key={comment?.id?.toString()}
            canDelete={user.id == comment.userId || user.id == post.user.Id}
            onDelete = {onDeleteCurrent}
            />
          )
        }

        {
          post?.postComments?.length == 0 && (
            <Text className="text-text ml-1.5 font-pregular text-[16px]">
              Be first to comment.
            </Text>
          )
        }

      </View>

    </ScrollView>
  </View>

  )
}

export default PostDetails