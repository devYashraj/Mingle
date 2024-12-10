import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        avatar: {
            type: String,
        },
        fullname: {
            type: String,
            required: [true, "Full name is required"]
        },
        headline: {
            type: String,
        },
        biography: {
            type: String
        },
        publicUrls: {
            type: [String]
        },
        savedPosts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }],
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User",userSchema);