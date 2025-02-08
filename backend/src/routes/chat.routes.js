import { Router } from "express";
import { createNewChat, getAllChats, getChatDetails } from '../controllers/chat.controller.js';
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.route('/newchat').post(createNewChat);
router.route('/allchats').get(getAllChats);
router.route('/c/:id').get(getChatDetails);

export default router;