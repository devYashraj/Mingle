import mongoose from "mongoose";

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

export const Following = mongoose.model("Following",followingSchema);