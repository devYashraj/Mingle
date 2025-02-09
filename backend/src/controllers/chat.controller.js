import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { emitSocketEvent } from '../socket/index.js';
import { CHAT_EVENTS } from "../constants.js";

const chatCommonAggregation = () => {
    return [
        {
            $lookup: {
                from : "users",
                localField: "participants",
                foreignField: "_id",
                as: "participants",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1
                        }
                    }
                ]
            }
        },
    ]
}

const createNewChat = asyncHandler(async (req, res) => {

    const { isGroupChat, name, members } = req.body;

    const groupChat = isGroupChat ? true : false;
    
    const memberIdStrings = members.filter((m) => {
        if(m._id !== req.user._id.toString())
            return true;
        else
            return false;
    })

   const memberIds = await Promise.all(memberIdStrings.map(async (id)=>{

        const user = await User.findById(id);

        if(!user){
            throw new ApiError(404,"Mentioned member not found")
        }

        return user._id;
    }))
    
    if(memberIds.length === 0){
        throw new ApiError(400,"Invalid chat member list")
    }

    if(groupChat){

        const chat = await Chat.create({
            name,
            isGroupChat: true,
            participants: [...memberIds, req.user._id],
            admin: req.user._id
        })

        const newChat = await Chat.aggregate([
            {
                $match: {_id: chat._id}
            },
            ...chatCommonAggregation()
        ])
        
        const participantList = newChat[0].participants;
    
        participantList.forEach((p)=>{
            if(p._id.toString() === req.user._id.toString())
                return;
        
            emitSocketEvent(
                req,
                p._id.toString(),
                CHAT_EVENTS.NEW_CHAT,
                newChat[0]
            )
        })

        return res.status(201).json(
            new ApiResponse(201,chat,"New chat created successfully")
        )
    }

    const participantId = memberIds[0];

    const chat = await Chat.findOne({
        isGroupChat: false,
        participants: { $all: [req.user._id, participantId] }
    });
    
    if(chat){
        throw new ApiError(400,'Chat already exists')
    }

    const newchat = await Chat.create({
        name: "private",
        isGroupChat: false,
        participants: [participantId, req.user._id],
    })

    const newChat = await Chat.aggregate([
        {
            $match: {_id: newchat._id}
        },
        ...chatCommonAggregation()
    ])
    
    const participantList = newChat[0].participants;

    participantList.forEach((p)=>{
        if(p._id.toString() === req.user._id.toString())
            return;
    
        emitSocketEvent(
            req,
            p._id.toString(),
            CHAT_EVENTS.NEW_CHAT,
            newChat[0]
        )
    })

    return res.status(201).json(
        new ApiResponse(201,newChat[0],"New chat created successfully")
    )
})

const getAllChats = asyncHandler(async (req, res) => {

    const chats = await Chat.aggregate([
        {
            $match: { participants: { $in: [req.user._id]} }
        },
        {
            $sort: { updatedAt: -1}
        },
        ...chatCommonAggregation()
    ])

    return res.status(200).json(
        new ApiResponse(200,chats,"Chats fetched successfully")
    )
})

const getChatDetails = asyncHandler(async (req, res) => {

    const { id } = req.params;
    
    const chats = await Chat.aggregate([
        {
            $match: { 
                participants: { $in: [req.user._id]}, 
                _id: new mongoose.Types.ObjectId(String(id)) 
            }
        },
        ...chatCommonAggregation()
    ])

    return res.status(200).json(
        new ApiResponse(200,chats,"Chat details fetched successfully")
    )
})

export {
    createNewChat,
    getAllChats,
    getChatDetails
}