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
    getSavedPosts,
    getSearchPosts,
    getPostsByTag,
    saveUnsavePost
} from '../controllers/post.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJwt);

router.route('/upload-image').post(upload.fields([{name: "media", maxCount: 4}]),uploadImage);
router.route('/upload-video').post(upload.fields([{name: "media", maxCount: 1}]),uploadVideo);
router.route('/upload-article').post(uploadArticle);
router.route('/save/:id').post(saveUnsavePost);

router.route('/feed').get(getFeedPosts);
router.route('/liked').get(getLikedPosts);
router.route('/saved').get(getSavedPosts);
router.route('/search').get(getSearchPosts);
router.route('/tag/:tag').get(getPostsByTag);

router.route('/:id').get(getPostById);
router.route('/u/:username').get(getPostsByUsername);

router.route('/:id').delete(deletePost);

export default router;