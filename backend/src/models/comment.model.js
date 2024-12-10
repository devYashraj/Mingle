import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: [true, "Comment cannot be empty"]
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    },
    {
        timestamps: true
    }
)

export const Comment = mongoose.model("Comment", commentSchema);