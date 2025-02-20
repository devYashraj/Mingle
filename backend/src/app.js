import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { initializeSocketIO } from './socket/index.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer,{
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }
});

app.set("io",io);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.enable('trust proxy');

import userRouter from './routes/user.routes.js'
import followRouter from './routes/following.routes.js';
import postRouter from './routes/post.routes.js';
import likeRouter from './routes/like.routes.js';
import commentRouter from './routes/comment.routes.js';
import chatsRouter from './routes/chat.routes.js';
import messageRouter from './routes/message.routes.js';

app.use('/api/v1/users',userRouter);
app.use('/api/v1/followings',followRouter);
app.use('/api/v1/posts',postRouter);
app.use('/api/v1/like',likeRouter);
app.use('/api/v1/comments',commentRouter);
app.use('/api/v1/chats',chatsRouter);
app.use('/api/v1/messages',messageRouter);

initializeSocketIO(io);

export default httpServer;