import { Router } from 'express';
import {
    uploadImage,
    uploadVideo,
    uploadArticle,
    deletePost,
    getPostById,
    getFeedPosts,
    getPostsByUsername,
    getLikedPosts,
    getSavedPosts
} from '../controllers/post.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJwt);

router.route('/upload-image').post(upload.fields([{name: "media", maxCount: 4}]),uploadImage);
router.route('/upload-video').post(upload.fields([{name: "media", maxCount: 1}]),uploadVideo);
router.route('/upload-article').post(uploadArticle);

router.route('/:id').delete(deletePost);

router.route('/:id').get(getPostById);

router.route('/feed').get(getFeedPosts);
router.route('/:username').get(getPostsByUsername);
router.route('/liked').get(getLikedPosts);
router.route('/saved').get(getSavedPosts);

export default router;