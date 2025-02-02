import apiClient from './index.js';
import asyncHandler from '../utils/asyncHandler.js';

const followUnfollowUser = asyncHandler(async (userId) => {
    const response = await apiClient.post(`/followings/follow/${userId}`);
    return response.data;
})

const getFollowers = asyncHandler(async (username) => {
    const response = await apiClient.post(`/followings/followers/${username}`);
    return response.data;
})

const getFollowings = asyncHandler(async (username) => {
    const response = await apiClient.post(`/followings/following/${username}`);
    return response.data;
})

export {
    followUnfollowUser,
    getFollowers,
    getFollowings
}