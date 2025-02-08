import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        emailVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        avatar: {
            type: String,
            default: ""
        },
        fullname: {
            type: String,
            required: [true, "Full name is required"]
        },
        headline: {
            type: String,
            default: ""
        },
        biography: {
            type: String,
            default: ""
        },
        publicUrls: {
            type: [String],
            default: []
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

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.getAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.getRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};


userSchema.plugin(aggregatePaginate);

export const User = mongoose.model("User",userSchema);