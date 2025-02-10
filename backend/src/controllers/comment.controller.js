import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { Comment } from '../models/comment.model.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Like} from '../models/like.model.js';
import redis from '../redis/index.js';

const postComment = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { text } = req.body;

    const post = await Post.findById(id);

    if(!post){
        throw new ApiError(404,"Post not found")
    }

    const newComment = await Comment.create({
        owner: req.user._id,
        text,
        post: post._id
    })
    
    return res.status(201).json(
        new ApiResponse(201,{newComment},"Comment added to post successfully")
    )
})

const postReply = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(id);

    if(!comment){
        throw new ApiError(404,"Comment not found")
    }

    if(!comment.post){
        throw new ApiError(400,"Cannot reply to a reply")
    }

    const newComment = await Comment.create({
        owner: req.user._id,
        text,
        comment: comment._id
    })
    
    return res.status(201).json(
        new ApiResponse(201,{newComment},"Comment added to post successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await Comment.deleteOne({_id: id});

    return res.status(200).json(
        new ApiResponse(200,{},"Comment deleted successfully")
    )
})

const commentAggregationPipelines = (my_id) => {
    return [
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user",
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "comment",
                as: "replies"
            }
        },
        {
            $addFields: {
                likesCount: { $size : "$likes"},
                commentsCount: {$size: "$replies"},
                fullName: { $arrayElemAt : ["$user.fullname",0]}, 
                avatar: { $arrayElemAt : ["$user.avatar",0]}, 
                username: { $arrayElemAt : ["$user.username",0]},
                liked: { $in: [my_id, "$likes.owner"]}
            }
        },
        {
            $project: {
                owner : 0,
                user: 0,
                likes: 0,
                replies: 0
            }
        }
    ]
}

const getPostComments = asyncHandler(async(req, res) => {

    const { id } = req.params;
    const { page = 1} = req.query;

    const post = await Post.findById(id);

    if(!post){
        throw new ApiError(404,"Post not found")
    }

    const aggregate = Comment.aggregate([
        {
            $match: { post: post._id}
        },
        {
            $sort: { createdAt: -1 }
        },
        ...commentAggregationPipelines(req.user._id),
    ])

    const options = {
        page: parseInt(page),
        limit: 5
    }

    const comments = await Comment.aggregatePaginate(aggregate,options);

    return res.status(200).json(
        new ApiResponse(200,comments,"Comments fetched successfully")
    )
})

const getCommentReplies = asyncHandler(async(req, res) => {
    
    const { id } = req.params;
    const { page = 1} = req.query;

    const comment = await Comment.findById(id);

    if(!comment){
        throw new ApiError(404,"Comment not found")
    }

    const aggregate = Comment.aggregate([
        {
            $match: { comment: comment._id}
        },
        {
            $sort: { createdAt: 1 }
        },
        ...commentAggregationPipelines(req.user._id),
    ])

    const options = {
        page: parseInt(page),
        limit: 5
    }

    const replies = await Comment.aggregatePaginate(aggregate,options);

    return res.status(200).json(
        new ApiResponse(200,replies,"Replies fetched successfully")
    )

})

const getUserComments = asyncHandler(async(req, res) => {
    
    const { username } = req.params;
    const { page = 1} = req.query;
    
    const user = await User.findOne({username: username});

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const aggregate = Comment.aggregate([
        {
            $match: {owner: user._id}
        },
        {
            $sort: { createdAt: -1}
        },
        ...commentAggregationPipelines(req.user._id),
        {
            $lookup: {
                from: "comments",
                localField: "comment",
                foreignField: "_id",
                as: "rel",
            }
        },
        {
            $addFields: {
                fromPost: { $arrayElemAt : ["$rel.post",0] }
            }
        },
        {
            $project: {
                rel: 0
            }
        }
    ])

    const options = {
        page: parseInt(page),
        limit: 5
    }

    const comments = await Comment.aggregatePaginate(aggregate,options);

    return res.status(200).json(
        new ApiResponse(200,comments,"Comments of username fetched successfully")
    )
    
})

const getLikedComments = asyncHandler(async(req, res) => {
    
    const { page = 1} = req.query;


    const aggregate = Like.aggregate([
        {
            $match: {owner: req.user._id, post: null}
        },
        {
            $sort: { createdAt : -1}
        },
        {
            $lookup: {
                from: "comments",
                localField: "comment",
                foreignField: "_id",
                as: "comments",
                pipeline: [
                    ...commentAggregationPipelines(req.user._id),
                    {
                        $lookup: {
                            from: "comments",
                            localField: "comment",
                            foreignField: "_id",
                            as: "rel",
                        }
                    },
                    {
                        $addFields: {
                            fromPost: { $arrayElemAt : ["$rel.post",0] }
                        }
                    },
                    {
                        $project: {
                            rel: 0
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                commentData: { $arrayElemAt: ["$comments",0]}
            }
        },
        {
            $project: {
                owner: 0,
                comments: 0,
                __v: 0
            }
        }
    ])

    const options = {
        page: parseInt(page),
        limit: 5
    }

    const key = `likedComments:${req.user._id.toString()}:${JSON.stringify(options)}`;
    const cachedComments = await redis.get(key);

    if(cachedComments){
        return res.status(200).json(
            new ApiResponse(200,JSON.parse(cachedComments),"Comments fetched successfully")
        )
    }

    const comments = await Like.aggregatePaginate(aggregate,options);

    await redis.set(key,JSON.stringify(comments));
    await redis.expire(key,10);
    
    return res.status(200).json(
        new ApiResponse(200,comments,"Comments fetched successfully")
    )

})

export {
    postComment,
    postReply,
    deleteComment,
    getCommentReplies,
    getPostComments,
    getUserComments,
    getLikedComments
}