import apiClient from './index.js';
import asyncHandler from '../utils/asyncHandler.js';

const getFeed = asyncHandler(async (page) => {

    const response = await apiClient.get(`/posts/feed?page=${page}`);
    return response.data;

})

const likePost = asyncHandler(async (postId) => {
    const response = await apiClient.post(`/like/post/${postId}`);
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

export {
    getFeed,
    likePost,
    savePost,
    getPostsByUsername,
    getLikedPosts,
    getSavedPosts,
    getPostById
}