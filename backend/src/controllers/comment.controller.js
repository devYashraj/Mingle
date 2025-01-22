import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { Comment } from '../models/comment.model.js';
import { Post } from '../models/post.model.js';

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
        new ApiResponse(201,{},"Comment added to post successfully")
    )
})

const postReply = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { text } = req.body;

    const comment = await Post.findById(id);

    if(!comment){
        throw new ApiError(404,"Comment not found")
    }

    if(comment.comment !== null){
        throw new ApiError(400,"Cannot reply to a reply")
    }

    const newComment = await Comment.create({
        owner: req.user._id,
        text,
        comment: comment._id
    })
    
    return res.status(201).json(
        new ApiResponse(201,{},"Comment added to post successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await Comment.deleteOne({_id: id});

    return res.status(200).json(
        new ApiResponse(200,{},"Comment deleted successfully")
    )
})

export {
    postComment,
    postReply,
    deleteComment
}