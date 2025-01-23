import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { Like } from '../models/like.model.js';
import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';

const likeUnlikePost = asyncHandler(async(req, res) => {
    
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if(!post){
        throw new ApiError(404, "Post not found")
    }

    const like = await Like.findOne({ owner: userId, post: postId });
    
    if(like){
        
        await Like.deleteOne({
            owner: userId,
            post: postId
        })

        return res.status(200).json(
            new ApiResponse(200,{ liked: false },"Post unliked successfully")
        )
    }

    const newLike = await Like.create({
        owner: userId,
        post: postId
    })

    return res.status(200).json(
        new ApiResponse(200,{ liked: true },"Post liked successsfully")
    )
})

const likeUnlikeComment = asyncHandler(async(req, res) => {

    const commentId = req.params.id;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(404, "Comment not found")
    }

    const like = await Like.findOne({ owner: userId, comment: commentId});
    
    if(like){

        await Like.deleteOne({
            owner: userId,
            comment: commentId
        })

        return res.status(200).json(
            new ApiResponse(200,{ liked: false },"Comment unliked successfully")
        )
    }

    const newLike = await Like.create({
        owner: userId,
        comment: commentId
    })

    return res.status(200).json(
        new ApiResponse(200,{ liked: true },"Comment liked successfully")
    )

})

export { likeUnlikePost, likeUnlikeComment}