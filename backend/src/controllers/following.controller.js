import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { Following } from '../models/following.model.js';

const follow = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (id === req.user._id.toString()) {
        throw new ApiError(400, 'Cannot follow self');
    }

    const existingFollow = await Following.findOne({ leader: id, follower: req.user._id });

    if (existingFollow) {
        throw new ApiError(400, 'Already following the user');
    }

    await Following.create({
        follower: req.user._id,
        leader: id
    })

    return res.status(200)
        .json(new ApiResponse(200, {}, 'Followed user successfully'))
})

const unfollow = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (id === req.user._id.toString()) {
        throw new ApiError(400, "Cannot unfollow self");
    }

    const existingFollow = await Following.findOne({ leader: id, follower: req.user._id });

    if (!existingFollow) {
        throw new ApiError(400, "User has already been unfollowed");
    }

    await Following.deleteOne({ leader: id, follower: req.user._id })

    return res.status(200)
        .json(new ApiResponse(200, {}, 'Unfollowed user successfully'))
})

const getFollowers = asyncHandler(async (req, res) => {

    const { username } = req.params;
    const { page = 1 } = req.query;
    const limit = 5;

    const user = await User.findOne({username: username});

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const aggregate = Following.aggregate([
        {
            $match: { leader: user._id }
        },
        {
            $lookup: {
                from: "users",
                localField: "follower",
                foreignField: "_id",
                as: "followerData"
            }
        },
        {
            $addFields: {
                avatar: { $arrayElemAt: ["$followerData.avatar", 0] },
                fullname: { $arrayElemAt: ["$followerData.fullname", 0] },
                username: { $arrayElemAt: ["$followerData.username", 0] },
                headline: { $arrayElemAt: ["$followerData.headline", 0] },
            }
        },
        {
            $project: {
                fullname: 1,
                avatar: 1,
                username: 1,
                headline: 1
            }
        }
    ])

    const options = {
        page: parseInt(page,10),
        limit
    }

    const followers = await Following.aggregatePaginate(aggregate,options);

    res.status(200)
        .json(new ApiResponse(200, followers, "Followers fetched sucessfully"))
})

const getFollowing = asyncHandler(async (req, res) => {

    const { username } = req.params;
    const { page = 1 } = req.query;
    const limit = 5;

    const user = await User.findOne({username: username});

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const aggregate = Following.aggregate([
        {
            $match: { follower: user._id }
        },
        {
            $lookup: {
                from: "users",
                localField: "leader",
                foreignField: "_id",
                as: "followings"
            }
        },
        {
            $addFields: {
                avatar: {$arrayElemAt: ["$followings.avatar", 0]},
                fullname: {$arrayElemAt: ["$followings.fullname", 0]},
                username: {$arrayElemAt: ["$followings.username", 0]},
                headline: {$arrayElemAt: ["$followings.headline", 0]},
            }
        },
        {
            $project: {
                avatar: 1,
                fullname: 1,
                username: 1,
                headline: 1
            }
        }
    ])

    const options = {
        page: parseInt(page),
        limit
    }

    const following = await Following.aggregatePaginate(aggregate,options);

    res.status(200)
        .json(new ApiResponse(200,following,'Fetched following successfully'))
})

export { follow, unfollow, getFollowers, getFollowing}