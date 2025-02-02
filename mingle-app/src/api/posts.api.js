import apiClient from './index.js';
import asyncHandler from '../utils/asyncHandler.js';

const getFeed = asyncHandler(async (page) => {

    const response = await apiClient.get(`/posts/feed?page=${page}`);
    return response.data;

})

const savePost = asyncHandler(async (postId) => {
    const response = await apiClient.post(`/posts/save/${postId}`)
    return response.data;
})

const getPostsByUsername = asyncHandler(async (username,page) => {
    const response = await apiClient.get(`/posts/u/${username}?page=${page}`);
    return response.data;
})

const getLikedPosts = asyncHandler(async (page) => {
    const response = await apiClient.get(`/posts/liked?page=${page}`);
    if(response.status === 200){
        const docs = response.data.data.docs.map((data)=>data.postData);
        response.data.data.docs = docs;
    }
    return response.data;
})

const getSavedPosts = asyncHandler(async (page) => {
    const response = await apiClient.get(`/posts/saved?page=${page}`);
    return response.data;
})

const getPostById = asyncHandler(async (postID) => {
    const response = await apiClient.get(`/posts/${postID}`);
    return response.data;
})

const getSearchPosts = asyncHandler(async (search, page) => {
    const response = await apiClient.get(`/posts/search/?search=${search}&page=${page}`)
    return response.data;
})

const deletePost = asyncHandler(async (postID) => {
    const response = await apiClient.delete(`/posts/${postID}`);
    return response.data;
})

const uploadImage = asyncHandler(async (data) => {
    const response = await apiClient.post(`/posts/upload-image`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
})

const uploadVideo = asyncHandler(async (data) => {
    const response = await apiClient.post(`/posts/upload-video`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
})

const uploadArticle = asyncHandler(async (data) => {
    const response = await apiClient.post(`/posts/upload-article`, data, {
        headers: {
            "Content-Type" : "application/json"
        }
    });
    return response.data;
})

const getPostsByTag = asyncHandler(async (tag, page) => {
    const response = await apiClient.get(`/posts/tag/${tag}?page=${page}`);
    return response.data;
})

export {
    getFeed,
    savePost,
    getPostsByUsername,
    getLikedPosts,
    getSavedPosts,
    getPostById,
    deletePost,
    uploadImage,
    uploadVideo,
    uploadArticle,
    getSearchPosts,
    getPostsByTag
}