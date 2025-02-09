import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { sendMessage, getAllMessages } from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJwt);

router.route('/send-message/:id').post(sendMessage);
router.route('/get-all-messages/:id').get(getAllMessages);

export default router;