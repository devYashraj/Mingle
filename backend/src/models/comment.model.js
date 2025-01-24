import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: {
            type: String,
            required: [true, "Comment cannot be empty"]
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    },
    {
        timestamps: true
    }
)

commentSchema.plugin(aggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);