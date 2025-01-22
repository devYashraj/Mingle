import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { extractPublicId } from 'cloudinary-build-url';
import { Post } from '../models/post.model.js';
import { ALLOWED_IMAGE_TYPES } from '../constants.js';
import path from 'path';
import mongoose from 'mongoose';

const uploadImage = asyncHandler(async (req, res) => {

    if(!req.files || !req.files.media){
        throw new ApiError(400,"Images are missing")
    }
    
    const { media } = req.files 

    const validatedFiles = media.filter((file)=>{
        
        const fileExtension = path.extname(file.originalname.toLowerCase());

        return file.mimetype.startsWith('image/') && ALLOWED_IMAGE_TYPES.includes(fileExtension);
    })

    if(validatedFiles.length !== media.length){
        throw new ApiError(400, "Please upload only images")
    }

    const mediafiles = await Promise.all(media.map(async (curFile) => {

        const curFilePath = curFile.path;

        const mediaFile = await uploadToCloudinary(curFilePath);

        if(!mediaFile || !mediaFile?.url)
        {
            throw new ApiError(500,"Error while uploading to cloudinary");
        } 
        
        return mediaFile.url;
    }));    

    const { title, description, tags } = req.body;

    const newPost = await Post.create({
            title,
            type: "image",
            description,
            tags,
            mediafiles,
            owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, { _id: newPost._id }, "Images uploaded successfully!")
    )
})

const uploadVideo = asyncHandler(async (req, res) => {
  
    if(!req.files || !req.files.media){
        throw new ApiError(400,"Video file is required");
    }
    
    const videoFile = req.files.media[0];

    const fileExtension = path.extname(videoFile.originalname.toLowerCase());

    if(fileExtension !== ".mp4" || !videoFile.mimetype.startsWith('video/')){
        throw new ApiError(400,"Unsupported file type");
    }

    const uploadedVideo = await uploadToCloudinary(videoFile.path)
    
    if(!uploadedVideo || !uploadedVideo?.url){
        throw new ApiError(500," Video upload to cloudinary failed");
    }

    const { title, description, tags} = req.body;

    const newPost = await Post.create({
        title,
        description,
        type: "video",
        mediafiles: [uploadedVideo.url],
        tags,
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, {id: newPost._id}, "Video uploaded successfully")
    )

})

const uploadArticle = asyncHandler(async (req, res) => {
    
    const { title, article, tags} = req.body;

    if(!title || !article){
        throw new ApiError(400,"Title or article body missing!")
    }

    const newPost = await Post.create({
        title,
        type: "article",
        article,
        tags,
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, {id: newPost._id} ,"Article uploaded successfully")
    )
})

const deletePost = asyncHandler(async (req, res) => {
    
    const { id } = req.params;
    
    const post = await Post.findOne({_id: id, owner: req.user._id});

    if(!post){
        throw new ApiError(404,"Post Not Found");
    }

    if(post.type !== "article")
    {
        const mediafiles = post.mediafiles;

        await Promise.all(mediafiles.map(async (file) => {

            const publicId = extractPublicId(file);
            await deleteFromCloudinary(publicId);
            return null;
        }))
    }

    await Post.deleteOne({ _id: id, ow});

    return res.status(200).json(
        new ApiResponse(200,{},"Post deleted successfully")
    );

})

const getPostById = asyncHandler(async (req, res) => {
    
    const { id } = req.params;

    const post = await Post.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(String(id))}
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments"
            }
        },
        {
            $addFields: {
                fullName: {
                    $arrayElemAt: ["$user.fullname",0]
                },
                avatar: {
                    $arrayElemAt: ["$user.avatar",0]
                },
                username: {
                    $arrayElemAt: ["$user.username",0]
                },
                likesCount: {
                    $size: "$likes"
                },
                commentsCount: {
                    $size: "$comments"
                },
                liked: {
                    $cond: [
                        { $in : [req.user._id, "$likes.owner"]},
                        true,
                        false
                    ]
                },
                saved: {
                    $cond: [
                        { $in : [req.user._id, "$user.saved"]},
                        true,
                        false
                    ]
                }
            }
        },
        {
            $project: {
                likes: 0,
                user: 0,
                owner: 0,
                comments: 0
            }
        }
    ]);

    if(!post || post?.length === 0){
        throw new ApiError(404, "Post Not Found");
    }

    return res.status(200)
            .json(new ApiResponse(200,{post: post[0]},"Post fetched successfully"))
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