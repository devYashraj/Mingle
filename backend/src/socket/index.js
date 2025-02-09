import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { CHAT_EVENTS } from '../constants.js';

const mountJoinChat = (socket) => {
    socket.on(CHAT_EVENTS.JOIN_CHAT, (chatId) => {
        socket.join(chatId);
        console.log(`User has joined chat ${chatId}`);
    })
}

const mountStartTyping = (socket) => {
    socket.on(CHAT_EVENTS.TYPING, (chatId)=>{
        socket.in(chatId).emit(CHAT_EVENTS.TYPING)
    })
}

const mountStopTyping = (socket) => {
    socket.on(CHAT_EVENTS.STOP_TYPING, (chatId)=>{
        socket.in(chatId).emit(CHAT_EVENTS.STOP_TYPING)
    })
}

const initializeSocketIO = (io) => {
    return io.on("connection", async (socket)=>{
        try {
            const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
            const token = cookies?.accessToken ;
            
            if(!token){
                token = socket.handshake.auth?.token
            }

            if(!token){
                throw new ApiError(401,"Unauthorized handshake. Missing token")
            }

            const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decodedToken?._id).select(
                "-password -refreshToken -savedPosts"
            )

            if(!user){
                throw new ApiError(401,"Unauthorized handshake. Token is invalid")
            }

            socket.user = user;

            socket.join(user._id.toString());
            socket.emit(CHAT_EVENTS.CONNECTED);
            console.log(`${user.username} has connected`);
            
            mountJoinChat(socket);
            mountStartTyping(socket);
            mountStopTyping(socket);

            socket.on(CHAT_EVENTS.DISCONNECT, ()=>{
                console.log(`${user.username} has disconnected`);
            })
        } 
        catch (error) {
            socket.emit(
                CHAT_EVENTS.SOCKET_ERROR,
                error?.message || "Error during connecting to socket"
            )
        }
    })
}

const emitSocketEvent = (req, roomId, event, payload) => {
    
    req.app.get("io").in(roomId).emit(event,payload);

}

export { initializeSocketIO, emitSocketEvent}