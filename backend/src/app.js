import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from './routes/user.routes.js'
import followRouter from './routes/following.routes.js';
import postRouter from './routes/post.routes.js';
import likeRouter from './routes/like.routes.js';
import commentRouter from './routes/comment.routes.js';

app.use('/api/v1/users',userRouter);
app.use('/api/v1/followings',followRouter);
app.use('/api/v1/posts',postRouter)
app.use('/api/v1/like',likeRouter);
app.use('/api/v1/comments',commentRouter)

export default app;