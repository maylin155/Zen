import { uploadFile } from "./imageService";
import { supabase } from "../lib/supabase";

export const createOrUpdatePost = async (post) => {
    try {
        //upload image
        if (post.file && typeof post.file == 'object') {
            let isImage = post?.file?.type == 'image';
            let folderName = isImage ? 'postImages' : 'postVideos';
            let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
            if (fileResult.success) post.file = fileResult.data;
            else {
                return fileResult;
            }
        }

        const { data, error } = await supabase
            .from('posts')
            .upsert(post)
            .select()
            .single();

        if (error) {
            console.log("Create Post error", error);
            return { success: false, msg: 'Could not create your post' }

        }
        return { success: true, data: data };

    } catch (error) {
        console.log('CreatePost error: ', error);
        return { success: false, msg: 'Could not create your post' }

    }
}

export const fetchPosts = async (limit = 5, userId) => {
    try {
        if(userId){
            const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                 user: users(id,name,image),
                 postLikes (*),
                 postComments (count)
                 `)
            .order('created_at', { ascending: false })
            .eq('userId', userId)
            .limit(limit)
        if (error) {
            return { success: false, msg: error?.message };
        }
        return { success: true, data: data };

        }else{
            const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                 user: users(id,name,image),
                 postLikes (*),
                 postComments (count)
                 `)
            .order('created_at', { ascending: false })
            .limit(limit)
        if (error) {
            return { success: false, msg: error?.message };
        }
        return { success: true, data: data };
        }

    } catch (error) {
        console.log('FetchPost error: ', error);
        return { success: false, msg: 'Could not fetch your post' }

    }
}


export const createPostLike = async (postLike) => {
    try {
        const { data, error } = await supabase
            .from('postLikes')
            .insert(postLike)
            .select()
            .single();
        if (error) {
            return { success: false, msg: error?.message };
        }
        return { success: true, data: data };

    } catch (error) {
        console.log('PostLike error: ', error);
        return { success: false, msg: 'Could not like the post' }

    }
}

export const removePostLike = async (postId, userId) => {
    try {
        const { error } = await supabase
            .from('postLikes')
            .delete()
            .eq('userId', userId)
            .eq('postId', postId)

        if (error) {
            return { success: false, msg: 'Could not remove the post like' };
        }
        return { success: true, data: data };

    } catch (error) {
        console.log('PostLike error: ', error);
        return { success: false, msg: 'Could not remove the post like' }

    }
}

const sanitizeHtml = require('sanitize-html');

export const cleanHTML = (htmlString) => {
    return sanitizeHtml(htmlString, {
        allowedTags: ['div', 'i', 'strong', 'em', 'p', 'h4'],
        allowedAttributes: {}
    });
}

export const fetchPostDetails = async (postId) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                 user: users(id,name,image),
                 postLikes (*),
                 postComments (*, user: users(id,name,image))
                 `)
            .eq('id', postId)
            .order("created_at", {ascending: false, foreignTable: 'postComments'})
            .single()

        if (error) {
            console.log("fetchPostDetails error", error);
            return { success: false, msg: 'Could not fetch the post'};
        }
        return { success: true, data: data };

    } catch (error) {
        console.log('FetchPostDetails error: ', error);
        return { success: false, msg: 'Could not fetch your post details' }

    }
}

export const createComment= async (comment) => {
    try {
        const { data, error } = await supabase
            .from('postComments')
            .insert(comment)
            .select()
            .single();
        if (error) {
            console.log('Comment error: ', error);
            return { success: false, msg: 'Could not create your comment' };
        }
        return { success: true, data: data };

    } catch (error) {
        console.log('Comment error: ', error);
        return { success: false, msg: 'Could not create your comment' }

    }
}

export const removeComment = async (commentId) => {
    try {
        const { error } = await supabase
            .from('postComments')
            .delete()
            .eq('id', commentId)

        if (error) {
            return { success: false, msg: 'Could not remove the post comment' };
        }
        return { success: true, data: {commentId}};

    } catch (error) {
        console.log('PostLike error: ', error);
        return { success: false, msg: 'Could not remove the post comment' }

    }
}