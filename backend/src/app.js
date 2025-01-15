import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from './routes/user.routes.js'
import followRouter from './routes/following.routes.js';

app.use('/api/v1/users',userRouter);
app.use('/api/v1/followings',followRouter);

export default app;