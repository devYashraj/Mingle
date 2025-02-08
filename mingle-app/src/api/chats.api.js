import apiClient from "./index.js";
import asyncHandler from '../utils/asyncHandler.js';

const createNewChat = asyncHandler(async(data) => {

    const response = await apiClient.post('/chats/newchat',data);

    return response.data;

})

const getAllChats = asyncHandler(async() => {

    const response = await apiClient.get('/chats/allchats');

    return response.data;

})

const getChatDetails = asyncHandler(async (id) => {
    
    const response = await apiClient.get(`/chats/c/${id}`);
    return response.data;

})

export {
    createNewChat,
    getAllChats,
    getChatDetails
}