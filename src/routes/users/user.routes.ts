import express from "express";
import { getAllUserList, uploadAvatar, statusChange, deleteUserRecord, updatedUserDetails } from "./../../controllers/user/userController"
import {
    verifyToken
} from "../../controllers/user/authController";

import {
    getAllUserValidation,
    uploadAvatarValidation,
    statusChangeValidation,
    deleteUserRecordValidation, SUDOOptionalUserAccessLevel, updateUserValidation
} from "../../middlewares/validators/user.validators";


const router = express.Router();
// router.post("/getAllUserList", verifyToken, getAllUserValidation, getAllUserList);
// router.post("/uploadProfileAvatar", verifyToken, uploadAvatarValidation, uploadAvatar);
// router.post("/statusChange", verifyToken, statusChangeValidation, statusChange);
// router.post("/deleteUserRecord", verifyToken, deleteUserRecordValidation, deleteUserRecord);
// router.post("/updatedUserDetails", verifyToken, updateUserValidation, SUDOOptionalUserAccessLevel, updatedUserDetails);

// // @route   GET /profile
// @desc    Get user profile
// @access  Private
//middleware handles validating the user exists and is logged in
// router.get('/profile', connectEnsureLogin.ensureLoggedIn("loginerror"), userProfile);

export default router;