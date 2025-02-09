import apiClient from "./index.js";
import asyncHandler from '../utils/asyncHandler.js';

const sendMessage = asyncHandler(async(chatId, content) => {
    
    const response = await apiClient.post(`/messages/send-message/${chatId}`, { content });
    return response.data;

})

const getAllMessages = asyncHandler(async(chatId) => {

    const response = await apiClient.get(`/messages/get-all-messages/${chatId}`);
    return response.data;

})

export {
    sendMessage,
    getAllMessages
}