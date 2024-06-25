import { validationResult } from 'express-validator';
const { oneOf, check } = require("express-validator");
import express, { Request, Response, NextFunction } from "express";

import passport from "passport";
import Session from "../../models/sessions/index"
import { IDelete } from "../../interfaces/IUser"

import {
    authAPIRequest,
    logoutOldSession,
    getUserProfile,
    verifyToken,
    clearExistingUserSessions,
    register
} from "../../controllers/user/auth.controller";

import {
    registrationValidation,
    resetPasswordValidation,
    loginValidation,
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
    "/authAPIRequest",
    verifyToken,
    oneOf([
        [check("functionName").equals("regularRegister"), ...registrationValidation],
        [check("functionName").equals("resetPassword"), ...resetPasswordValidation],
    ]),
    handleValidationErrors,
    authAPIRequest
);

router.post(
    "/regularRegister",
    registrationValidation,
    handleValidationErrors,
    register
);

router.post("/login", loginValidation, logoutOldSession, function (req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', function (err: any, user: any, info: any) {
        if (err) {

            return next(err);
        }
        if (!user) {

            return res.send({ message: "Invalid User Or Password", error: true });
        }
        // console.log("info",user)
        // // Function to clear existing user sessions

        // Clear any existing sessions for the user
        clearExistingUserSessions(user.id).then(() => {
            // Establish a new session for the current login
            req.logIn(user, function (err: any) {
                if (err) { return next(err); }
                // console.log("hehhehheeheheh", req.session);

                next()
            });
        }).catch(err => {
            console.error('Error clearing existing sessions:', err);
            return next(err);
        });

    })(req, res, next);
},
    getUserProfile);



router.get("/logout", logoutOldSession, async function (req, res) {
    // res.status(200).send({});
    // console.log("isAuthenticated", req.user);
    try {
        const response: IDelete = await Session.deleteOne({ _id: req.body.loginUser.session });
        if (response.acknowledged && response.deletedCount > 0) {
            res.status(200).send({
                message: "You have been logged out"
            });
        } else {
            res.status(200).send({
                message: "Please Login First"
            });
        }
    } catch (error: any) {
        console.log("error : ", error)
        res.status(error.status).send({
            message: "Issue with Logout"
        });
    }


    // req.logout((err: any) => {
    //     if (err) {
    //         console.error(err);
    //         res.status(500).send({ message: "Error logging out" });
    //     }
    //     else {
    //         res.redirect("logoutsuccess");
    //     }
    // });

})

export default router;