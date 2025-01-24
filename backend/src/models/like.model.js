import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true
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

likeSchema.plugin(aggregatePaginate);

export const Like = mongoose.model("Like",likeSchema);