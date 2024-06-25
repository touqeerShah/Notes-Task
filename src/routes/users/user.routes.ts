import express, { Request, Response, NextFunction } from "express";
import { validationResult } from 'express-validator';
const { oneOf, check } = require("express-validator");

import {
    verifyToken
} from "../../controllers/user/auth.controller";
import {
    userAPIRequest
} from "../../controllers/user/user.controller";

import {
    statusChangeValidation,
    deleteUserRecordValidation,
    getDetailValidation,
    updateUserValidation
} from "../../middlewares/validators/user.validators";


const router = express.Router();
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
router.post(
    "/userAPIRequest",
    verifyToken,
    oneOf([
        [check("functionName").equals("statusChange"), ...statusChangeValidation],
        [check("functionName").equals("deleteMyAccount"), ...deleteUserRecordValidation],
        [check("functionName").equals("getUserDetails"), ...getDetailValidation],
        [check("functionName").equals("updateUserDetails"), ...updateUserValidation],
    ]),
    handleValidationErrors,
    userAPIRequest
);
export default router;