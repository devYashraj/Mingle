//post comment
//post reply
//delete comment

//pagination needed here
//get comments by post
//get replies by comment
//get comments by profile
//get liked comments
import { Router } from 'express';
import { 
    postComment,
    postReply,
    deleteComment
} from '../controllers/comment.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJwt);

router.route('/post/:id').post(postComment);
router.route('/reply/:id').post(postReply);

router.route('/:id').delete(deleteComment);

export default router;