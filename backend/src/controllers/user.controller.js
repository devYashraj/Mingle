import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import mongoose from 'mongoose';

const getAccessAndRefreshTokens = async (id) => {
    try {
        const user = await User.findById(id);
        const accessToken = user.getAccessToken();
        const refreshToken = user.getRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, 'Token generation failed!');
    }

}

const registerUser = asyncHandler(async (req, res) => {

    const { firstName, lastName, email, username, password } = req.body;

    if ([firstName, lastName, email, username, password].some((i) => i?.trim() === "")) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }

    const user = await User.create({
        username,
        password,
        email,
        fullname: firstName + ' ' + lastName,
    })

    if (!user) {
        throw new ApiError(500, 'Somthing went wrong during account creation!')
    }

    return res.status(201).json(
        new ApiResponse(201, user.fullname, 'Account created successfully!')
    )
});

const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, 'Username or Email is required')
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!existingUser) {
        throw new ApiError(404, 'Invalid username or email!')
    }

    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, 'Invalid credentials!')
    }

    const { accessToken, refreshToken } = await getAccessAndRefreshTokens(existingUser._id);

    const loggedInUser = await User.findById(existingUser._id).select('-password -refreshToken -savedPosts');

    const options = {
        httpOnly: true,
        secure: process.env.MODE === 'production'
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                'Logged in successfully'
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 }
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.MODE === 'production'
    }

    return res.status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(
            new ApiResponse(200, {}, 'User logged out successfully')
        )
})


const updateProfile = asyncHandler(async (req, res) => {
    
    let avatarUrl = req.user.avatar;

    if (req.files && req.files?.avatar) {
        
        const avatarLocalPath = req.files?.avatar[0]?.path;
        const avatar = await uploadToCloudinary(avatarLocalPath);

        if(avatar !== null)
            avatarUrl = avatar.url;

        if (!avatar.url) {
            throw new ApiError(500, 'Error while updating Avatar')
        }
    }

    const { firstName, lastName, headline, biography, publicUrls } = req.body;

    if (firstName.trim() === "" || lastName.trim() === "") {
        throw new ApiError(400, 'Firstname or Lastname is missing')
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullname: firstName + ' ' + lastName,
                avatar: avatarUrl,
                headline: headline,
                biography: biography,
                publicUrls: publicUrls
            }
        },
        { new: true }
    ).select('-password -refreshToken');

    return res.status(200)
        .json(new ApiResponse(200, user, 'Profile Updated Successfully'))
})

const changePassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword?.trim() || !newPassword?.trim()) {
        throw new ApiError(400, 'Passwords are required')
    }

    const user = await User.findById(req.user._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid Password!");
    }

    user.password = newPassword.trim();
    await user.save();

    return res.status(200)
        .json(
            new ApiResponse(200, {}, "Password Changed Successfully")
        )
})

const getUserProfileData = asyncHandler(async (req, res) => {

    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, 'Username is required')
    }

    const user = await User.findOne({username})

    if(!user) {
        throw new ApiError(404,"User not found");
    }

    const profileData = await User.aggregate([
        {
            $match: { username: username }
        },
        {
            $lookup: {
                from: "followings",
                localField: "_id",
                foreignField: "leader",
                as: "followers"
            }
        },
        {
            $lookup: {
                from: 'followings',
                localField: "_id",
                foreignField: "follower",
                as: 'following'
            }
        },
        {
            $addFields: {
                followersCount: {
                    $size: "$followers"
                },
                followingCount: {
                    $size: "$following"
                },
                followedByMe: {
                    $cond: [
                        { $in: [req.user._id, "$followers.follower"] },
                        true, 
                        false 
                    ]
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                email: 1,
                avatar: 1,
                headline: 1,
                biography: 1,
                followersCount: 1,
                followingCount: 1,
                followedByMe: 1,
                publicUrls: 1
            }
        }
    ])  

    res.status(200).json(
        new ApiResponse(200,profileData,'Profile fetched successfully')
    )    
})

const getMyProfileData = asyncHandler(async (req, res) => {

    const profileData = await User.aggregate([
        {
            $match: { _id: req.user._id }
        },
        {
            $lookup: {
                from: "followings",
                localField: "_id",
                foreignField: "leader",
                as: "followers"
            }
        },
        {
            $lookup: {
                from: 'followings',
                localField: "_id",
                foreignField: "follower",
                as: 'following'
            }
        },
        {
            $addFields: {
                followersCount: {
                    $size: "$followers"
                },
                followingCount: {
                    $size: "$following"
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                email: 1,
                avatar: 1,
                headline: 1,
                biography: 1,
                followersCount: 1,
                followingCount: 1,
                publicUrls: 1
            }
        }
    ])  

    res.status(200).json(
        new ApiResponse(200,profileData,'Profile fetched successfully')
    ) 

})

const getUserList = asyncHandler(async (req, res) => {

    const { searchQuery } = req.params;

    if(!searchQuery){
        throw new ApiError(400,"Search query is required")
    }

    const userlist = await User.find(
        {
            $or: [
                {
                    fullname: { $regex: new RegExp(searchQuery,"i") }
                },
                {
                    username: { $regex: new RegExp(searchQuery, "i")}
                }
            ]
        },
        { fullname: 1, username: 1}
    )

    return res.status(200).json(
        new ApiResponse(200, userlist, "Users fetched successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfileData,
    getMyProfileData,
    updateProfile,
    changePassword,
    getUserList
}