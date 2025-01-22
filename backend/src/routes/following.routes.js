import { Router } from 'express';
import { followUnfollowUser, getFollowers, getFollowing } from '../controllers/following.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJwt);

router.route('/follow/:id').post(followUnfollowUser);
router.route('/followers/:username').get(getFollowers);
router.route('/following/:username').get(getFollowing);

export default router;