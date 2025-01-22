import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            index: true
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            index: true
        }
    },
    {
        timestamps: true
    }
)

export const Like = mongoose.model("Like",likeSchema);