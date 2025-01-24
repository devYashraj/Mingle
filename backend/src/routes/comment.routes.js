import { Router } from 'express';
import { 
    postComment,
    postReply,
    deleteComment,
    getPostComments,
    getCommentReplies,
    getUserComments,
    getLikedComments
} from '../controllers/comment.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJwt);

router.route('/post/:id').post(postComment);
router.route('/comment/:id').post(postReply);

router.route('/:id').delete(deleteComment);

router.route('/post/:id').get(getPostComments);
router.route('/comment/:id').get(getCommentReplies);
router.route('/u/:username').get(getUserComments)
router.route('/liked').get(getLikedComments);

export default router;