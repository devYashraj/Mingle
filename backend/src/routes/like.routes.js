import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { likeUnlikePost, likeUnlikeComment } from '../controllers/like.controller.js';

const router = Router();

router.use(verifyJwt);

router.route('/post/:id').post(likeUnlikePost);
router.route('/comment/:id').post(likeUnlikeComment);

export default router;