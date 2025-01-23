import { Router } from "express";
import {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfileData,
    getMyProfileData,
    updateProfile,
    changePassword,
} from '../controllers/user.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

//protected routes
router.route('/myprofile').get(verifyJwt,getMyProfileData);
router.route('/profile/:username').get(verifyJwt, getUserProfileData);
router.route('/change-password').patch(verifyJwt,changePassword)
router.route('/update-profile').patch(
    verifyJwt,
    upload.fields([{ name: 'avatar', maxCount: 1}]),
    updateProfile
)
router.route('/logout').post(verifyJwt, logoutUser);

export default router;