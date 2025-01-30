import apiClient from './index.js';
import asyncHandler from '../utils/asyncHandler.js';

const likeUnlikePost = asyncHandler(async(postId) => {
    const response = await apiClient.post(`/like/post/${postId}`)
    return response.data;
})

const likeUnlikeComment = asyncHandler(async(commentId) => {
    const response = await apiClient.post(`/like/comment/${commentId}`)
    return response.data;
})

export { likeUnlikePost, likeUnlikeComment}