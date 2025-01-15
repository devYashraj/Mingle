import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const uploadImage = asyncHandler(async (req, res) => {

})

const uploadVideo = asyncHandler(async (req, res) => {
    
})

const uploadArticle = asyncHandler(async (req, res) => {
    
})

const deletePost = asyncHandler(async (req, res) => {
    
})

const getPostById = asyncHandler(async (req, res) => {
    
})

const getFeedPosts = asyncHandler(async (req, res) => {
    
})

const getPostsByUsername = asyncHandler(async (req, res) => {
    
})

const getLikedPosts = asyncHandler(async (req, res) => {
    
})

const getSavedPosts = asyncHandler(async (req, res) => {
    
})

export {
    uploadImage,
    uploadVideo,
    uploadArticle,
    deletePost,
    getPostById,
    getFeedPosts,
    getPostsByUsername,
    getLikedPosts,
    getSavedPosts
}