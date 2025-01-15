import { Router } from 'express';
import { follow, unfollow, getFollowers, getFollowing } from '../controllers/following.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJwt);

router.route('/follow/:id').post(follow);
router.route('/unfollow/:id').post(unfollow);
router.route('/followers/:username').get(getFollowers);
router.route('/following/:username').get(getFollowing);

export default router;