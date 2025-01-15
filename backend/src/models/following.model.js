import mongoose from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const followingSchema = new mongoose.Schema(
    {
        follower:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        leader:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true
    }
)

followingSchema.plugin(aggregatePaginate);

export const Following = mongoose.model("Following",followingSchema);