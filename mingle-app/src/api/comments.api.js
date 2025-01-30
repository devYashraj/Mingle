import apiClient from './index.js';
import asyncHandler from '../utils/asyncHandler.js';

const getPostComments = asyncHandler(async (postId, page) => {
    const response = await apiClient.get(`/comments/post/${postId}?page=${page}`);
    return response.data;
})

const getCommentReplies = asyncHandler(async (commentId, page) => {
    const response = await apiClient.get(`/comments/comment/${commentId}?page=${page}`);
    return response.data;
})

const getCommentsByUsername = asyncHandler(async (username, page) => {
    const response = await apiClient.get(`/comments/u/${username}?page=${page}`);
    return response.data;
})

const getLikedComments = asyncHandler(async (page) => {
    const response = await apiClient.get(`/comments/liked?page=${page}`);
    if(response.status === 200){
        const docs = response.data.data.docs.map((c)=>c.commentData)
        response.data.data.docs = docs
    }
    return response.data;
})

const postComment = asyncHandler(async (postId,comment) => {
    const response = await apiClient.post(`/comments/post/${postId}`, {text: comment});
    return response.data;
})

const postReply = asyncHandler(async (commentId,reply) => {
    const response = await apiClient.post(`/comments/comment/${commentId}`,  {text: reply})
    return response.data;
})

export {
    getPostComments,
    getCommentReplies,
    getCommentsByUsername,
    getLikedComments,
    postComment,
    postReply
}