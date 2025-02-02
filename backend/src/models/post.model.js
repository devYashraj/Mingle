import mongoose from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
            ref: "User",
            required: true
        },
        article: {
            type: String,
            validate: {
                validator: function (value) {
                    if(this.type === 'article'){
                        return value !== null && value.trim().length > 0;
                    }
                    return true;
                },
                message : 'Article content is required'
            }
        },
        description: {
            type: String
        },
        mediafiles: {
            type: [String],
            validate: {
                validator: function (value) {
                    if(this.type === 'image' || this.type === 'video'){
                        return Array.isArray(value) && value.length > 0;
                    }
                    return true;
                },
                message: 'Media files are required!'
            }
        },
        tags: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
)

postSchema.index({title: 'text'})

postSchema.plugin(aggregatePaginate);

export const Post = mongoose.model("Post",postSchema);