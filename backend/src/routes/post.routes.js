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
} from '../controllers/posts.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJwt);

router.route('/posts/upload/image').post(upload.fields([{name: "image", maxCount: 4}]),uploadImage);
router.route('/posts/upload/video').post(upload.fields([{name: "video", maxCount: 1}]),uploadVideo);
router.route('/posts/upload/article').post(uploadArticle);

router.route('/posts/post/id').delete(deletePost);

router.route('/posts/post/id').get(getPostById);

router.route('/posts/feed').get(getFeedPosts);
router.route('/posts/:username').get(getPostsByUsername);
router.route('/posts/liked').get(getLikedPosts);
router.route('/posts/saved').get(getSavedPosts);