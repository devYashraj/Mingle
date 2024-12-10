import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Post title is required"]
        },
        type: {
            type: String,
            required: true,
            enum: ["article", "image", "video"]
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        description: {
            type: String
        },
        mediaFile: {
            type: String,
        },
        tags: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
)

export const Post = mongoose.model("Post",postSchema);