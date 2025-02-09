import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { emitSocketEvent } from '../socket/index.js';
import { CHAT_EVENTS } from "../constants.js";
import { Chat } from "../models/chat.model.js";
import { Message } from '../models/message.model.js';

const messageAggregationPipelines = () => {
    return [
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                username: { $arrayElemAt: ["$user.username", 0]},
                fullname: { $arrayElemAt: ["$user.fullname", 0]},
            }
        },
        {
            $project: {
                user: 0
            }
        }
    ]
}

const sendMessage = asyncHandler(async (req, res) => {

    const { content } = req.body;
    const { id }  = req.params;

    if(!content){
        throw new ApiError(400,'Message content is required');
    }

    const chat = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(String(id)),
        participants: {$in : [req.user._id]}
    })
    
    if(!chat){
        throw new ApiError(400,'Invalid chat Id')
    }

    const newMsg = await Message.create({
        sender: req.user._id,
        chat: chat._id,
        content,
    })

    const newMessage = await Message.aggregate([
        {
            $match: { _id: newMsg._id},
        },
        ...messageAggregationPipelines()
    ])
    
    const payload = newMessage[0];

    const participantList = chat.participants;

    participantList.forEach((p)=>{

        if(p._id.toString() === req.user._id.toString())
            return;
        
        emitSocketEvent(
            req,
            p._id.toString(),
            CHAT_EVENTS.MSG_RECEIVED,
            payload
        )
    });

    return res.status(201).json(
        new ApiResponse(201,payload,'Message sent successfully')
    )
})

const getAllMessages = asyncHandler(async (req, res) => {
    
    const { id }  = req.params;

    const chat = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(String(id)),
        participants: {$in : [req.user._id]}
    })
    
    if(!chat){
        throw new ApiError(400,'Invalid chat Id')
    }

    const messages = await Message.aggregate([
        {
            $match: { chat: chat._id},
        },
        {
            $sort: { createdAt: 1}
        },
        ...messageAggregationPipelines()
    ])
    
    return res.status(200).json(
        new ApiResponse(200,messages,'Messages fetched successfully')
    )
})

export {
    sendMessage,
    getAllMessages
}