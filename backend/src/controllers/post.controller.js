import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { extractPublicId } from 'cloudinary-build-url';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Like } from '../models/like.model.js';
import { ALLOWED_IMAGE_TYPES } from '../constants.js';
import path from 'path';
import mongoose from 'mongoose';
import redis from '../redis/index.js';

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
            tags:  tags.split(','),
            mediafiles,
            owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, { id: newPost._id }, "Images uploaded successfully!")
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
        tags:  tags.split(','),
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
        tags: tags.split(','),
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
            await deleteFromCloudinary(publicId,post.type);
            return null;
        }))
    }

    await Post.deleteOne({ _id: id,  owner: req.user._id});

    return res.status(200).json(
        new ApiResponse(200,{deleted:true},"Post deleted successfully")
    );

})

const postAggregationPipelines = (my_id,mySavedPosts) => {
    return [
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
                fullName: { $arrayElemAt: ["$user.fullname",0] },
                avatar: { $arrayElemAt: ["$user.avatar",0] },
                username: { $arrayElemAt: ["$user.username",0] },
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" },
                liked: { 
                    $cond: [
                        { $in : [my_id, "$likes.owner"]},
                        true,
                        false
                    ]
                },
                saved: {
                    $cond: [
                        { $in : ["$_id", mySavedPosts] },
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
                comments: 0,
                __v: 0,
                updatedAt: 0
            }
        }
    ]
}

const getPostById = asyncHandler(async (req, res) => {
    
    const { id } = req.params;

    const post = await Post.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(String(id))}
        },
        ...postAggregationPipelines(req.user._id,req.user.savedPosts),
    ]);

    if(!post || post?.length === 0){
        throw new ApiError(404, "Post Not Found");
    }

    return res.status(200)
            .json(new ApiResponse(200,{post: post[0]},"Post fetched successfully"))
})

const getFeedPosts = asyncHandler(async (req, res) => {
    
    const { page = 1 } = req.query;
    
    const aggregate = Post.aggregate([
        { 
            $sort : {createdAt : -1}
        },
        ...postAggregationPipelines(req.user._id,req.user.savedPosts),
    ])

    const options = {
        page : parseInt(page),
        limit: 10
    }

    const key = `feed:${req.user._id.toString()}:${JSON.stringify(options)}`;

    const cachedPosts = await redis.get(key);
    
    if(cachedPosts){
        return res.status(200).json(
            new ApiResponse(200,JSON.parse(cachedPosts),"Feed fetched successfully")
        )
    }
    const posts = await Post.aggregatePaginate(aggregate,options);

    await redis.set(key,JSON.stringify(posts))
    await redis.expire(key,10);

    return res.status(200).json(
        new ApiResponse(200,posts,"Feed fetched successfully")
    )
})

const getPostsByUsername = asyncHandler(async (req, res) => {
    
    const { page = 1 } = req.query;
    const { username } = req.params;
    
    const user = await User.findOne({username})

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const aggregate = Post.aggregate([
        {
            $match: {owner: user._id}
        },
        { 
            $sort : {createdAt : -1}
        },
        ...postAggregationPipelines(req.user._id,req.user.savedPosts),
    ])

    const options = {
        page : parseInt(page),
        limit: 10
    }

    const posts = await Post.aggregatePaginate(aggregate,options);

    return res.status(200).json(
        new ApiResponse(200,posts,"Posts by username fetched successfully")
    )

})

const getLikedPosts = asyncHandler(async (req, res) => {
    
    const { page = 1 } = req.query;

    const aggregate = Like.aggregate([
        {
            $match: { owner: req.user._id, comment: null}
        },
        {
            $sort: { createdAt: -1}
        },
        {
            $lookup: {
                from: "posts",
                localField: "post",
                foreignField: "_id",
                as: "post",
                pipeline: [
                    ...postAggregationPipelines(req.user._id,req.user.savedPosts)
                ]
            },
        },
        {
            $addFields: {
                postData: { $arrayElemAt : ["$post",0]} 
            }
        },
        {
            $project: {
                postData: 1,
                _id: 0
            }
        }
    ])

    const options = {
        page : parseInt(page),
        limit: 10
    }

    const key = `likedPosts:${req.user._id.toString()}:${JSON.stringify(options)}`;

    const cachedPosts = await redis.get(key);
    
    if(cachedPosts){
        return res.status(200).json(
            new ApiResponse(200,JSON.parse(cachedPosts),"Liked posts fetched successfully")
        )
    }
    const likedPosts = await Like.aggregatePaginate(aggregate,options);

    await redis.set(key,JSON.stringify(likedPosts));
    await redis.expire(key,10);

    return res.status(200).json(
        new ApiResponse(200,likedPosts,"Liked posts fetched successfully")
    )
})

const getSavedPosts = asyncHandler(async (req, res) => {

    const { page = 1} = req.query;

    const aggregate = Post.aggregate([
        {
            $match: { _id: {$in: req.user.savedPosts}}
        },
        ...postAggregationPipelines(req.user._id,req.user.savedPosts)
    ])

    const options = {
        page: parseInt(page),
        limit: 10
    }

    const savedPosts = await Post.aggregatePaginate(aggregate,options);
    
    return res.status(200).json(
        new ApiResponse(200,savedPosts,"Saved posts fetched successfully")
    )
})

const getSearchPosts = asyncHandler(async (req, res) => {
    
    const { search } = req.query;
    const { page = 1} = req.query;

    if(!search){
        throw new ApiError(400,"Search field cannot be empty")
    }

    const aggregate = Post.aggregate([
        {
            $match: { $text: { $search: search}}
        },
        {
            $sort: { createdAt : -1}
        },
        ...postAggregationPipelines(req.user._id,req.user.savedPosts)
    ])

    const options = {
        page: parseInt(page),
        limit: 1
    }

    const posts = await Post.aggregatePaginate(aggregate,options);

    return res.status(200).json(
        new ApiResponse(200,posts,"Posts fetched succesfully")
    )
})

const getPostsByTag = asyncHandler(async (req, res) => {

    const { tag } = req.params; 
    const { page = 1 } = req.query;

    const aggregate = Post.aggregate([
        {
            $match: { tags : {$in: [tag]}}
        },
        {
            $sort: { createdAt : -1}
        },
        ...postAggregationPipelines(req.user._id,req.user.savedPosts)
    ])

    const options = {
        page: parseInt(page),
        limit: 10
    }

    const posts = await Post.aggregatePaginate(aggregate,options);

    return res.status(200).json(
        new ApiResponse(200,posts,"Posts fetched successfully for given tag")
    )
})

const getTrendingData = asyncHandler(async( req, res) => {

    const cachedValue = await redis.get('mingleTrending');

    if(cachedValue){
        return res.status(200).json(
            new ApiResponse(200,JSON.parse(cachedValue), "Trending data fetched successfully")
        )
    }

    const trendingPosts = await Post.aggregate([
        {
            $lookup:{
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
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $project: {
                title: 1,
                avatar: { $arrayElemAt: ["$owner.avatar", 0]},
                fullname: { $arrayElemAt: ["$owner.fullname", 0]},
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" },
                totalInteractions: { $add: [{ $size: "$likes" }, { $size: "$comments" }] }
            }
        },
        {
            $sort: { totalInteractions: -1 }
        },
        {
            $limit: 3
        }
    ]);

    const trendingTags = await Post.aggregate([
        {
            $unwind: "$tags"
        },
        {
            $group: {
                _id: "$tags",
                count: { $sum : 1}
            }
        },
        {
            $sort: { count : -1 }
        },
        {
            $limit: 3
        },
        {
            $project: {
                _id: 0,
                tag: "$_id",
                count: 1
            }
        }
    ])

    const mingleTrending = { trendingPosts, trendingTags};
    
    await redis.set('mingleTrending',JSON.stringify(mingleTrending));
    await redis.expire('mingleTrending',60);

    return res.status(200).json(
        new ApiResponse(200,mingleTrending, "Trending data fetched successfully")
    )
})

const saveUnsavePost = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const post = await Post.findById(id);

    if(!post){
        throw new ApiError(404,"Post not found");
    }

    const existingSave = req.user.savedPosts.find((p) => p.equals(id));

    if(existingSave){

        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { savedPosts: { $in: [post._id] } }}
        )

        return res.status(200).json(
            new ApiResponse(200,{saved:false},"Post unsaved successfully")
        )
    }

    await User.findByIdAndUpdate(
        {_id: req.user._id},
        { $push: { savedPosts: post._id}}
    )

    return res.status(201).json(
        new ApiResponse(201,{saved:true},"Post saved successfully")
    )
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
    getSavedPosts,
    getSearchPosts,
    getPostsByTag,
    saveUnsavePost,
    getTrendingData
}