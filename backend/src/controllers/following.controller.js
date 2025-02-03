import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { Following } from '../models/following.model.js';

const followUnfollowUser = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (id === req.user._id.toString()) {
        throw new ApiError(400, 'Cannot follow or unfollow self');
    }

    const existingFollow = await Following.findOne({ leader: id, follower: req.user._id });

    if (existingFollow) {
        await Following.deleteOne({ leader: id, follower: req.user._id })

        return res.status(200)
            .json(new ApiResponse(200, {followedByMe: false}, 'Unfollowed user successfully'))
    }

    await Following.create({
        follower: req.user._id,
        leader: id
    })

    return res.status(200)
        .json(new ApiResponse(200, {followedByMe: true}, 'Followed user successfully'))
})

const getFollowers = asyncHandler(async (req, res) => {

    const { username } = req.params;
    const { page = 1 } = req.query;

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
                as: "followerData",
                pipeline: [
                    {
                        $lookup: {
                            from: "followings",
                            localField: "_id",
                            foreignField: "leader",
                            as: "followers"
                        }
                    },
                    {
                        $addFields: {
                            followedByMe: {
                                $in: [req.user._id, "$followers.follower"]
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                avatar: { $arrayElemAt: ["$followerData.avatar", 0] },
                fullname: { $arrayElemAt: ["$followerData.fullname", 0] },
                username: { $arrayElemAt: ["$followerData.username", 0] },
                headline: { $arrayElemAt: ["$followerData.headline", 0] },
                userId: { $arrayElemAt: ["$followerData._id", 0]},
                followedByMe: { $arrayElemAt: ["$followerData.followedByMe", 0] }
            }
        },
        {
            $project: {
                fullname: 1,
                avatar: 1,
                username: 1,
                headline: 1,
                followedByMe: 1,
                userId: 1,
            }
        }
    ])

    const options = {
        page: parseInt(page,10),
        limit: 10
    }

    const followers = await Following.aggregatePaginate(aggregate,options);

    res.status(200)
        .json(new ApiResponse(200, followers, "Followers fetched sucessfully"))
})

const getFollowing = asyncHandler(async (req, res) => {

    const { username } = req.params;
    const { page = 1 } = req.query;

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
                as: "followings",
                pipeline: [
                    {
                        $lookup: {
                            from: "followings",
                            localField: "_id",
                            foreignField: "leader",
                            as: "followers"
                        }
                    },
                    {
                        $addFields: {
                            followedByMe: {
                                $in: [req.user._id, "$followers.follower"]
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                avatar: {$arrayElemAt: ["$followings.avatar", 0]},
                fullname: {$arrayElemAt: ["$followings.fullname", 0]},
                username: {$arrayElemAt: ["$followings.username", 0]},
                headline: {$arrayElemAt: ["$followings.headline", 0]},
                userId: { $arrayElemAt: ["$followings._id", 0]},
                followedByMe: { $arrayElemAt: ["$followings.followedByMe", 0]}
            }
        },
        {
            $project: {
                avatar: 1,
                fullname: 1,
                username: 1,
                headline: 1,
                followedByMe: 1,
                userId: 1
            }
        }
    ])

    const options = {
        page: parseInt(page),
        limit: 10
    }

    const following = await Following.aggregatePaginate(aggregate,options);

    res.status(200)
        .json(new ApiResponse(200,following,'Fetched following successfully'))
})

export { followUnfollowUser, getFollowers, getFollowing}