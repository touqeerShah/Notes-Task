import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { userProfile } from '../../controllers/Users/user.controller';
import Session from "../../models/Sessions/index"
import { IDelete } from "../../interfaces/IUser"
import {
    SUDO_REGISTER,
    regularRegister,
    resetPasswordRequest,
    verifyToken,
    resetUserPass, getUserDetails, adminResetUserPass,
    getUserDetailsByUserID
} from "../../controllers/user/authController";
import {
    SUDOMiddleware,
    registerMiddleware,
    resetPassRequestMiddleWare,
    resetPasswordMiddleware,
    rememberMe,
    removeOldSession,
    clearExistingUserSessions
} from "../../middlewares/authMiddleware";
import {
    registrationValidation,
    SUDOOptionalUserAccessLevel,
    resetPassRequestValidation,
    resetPasswordValidation,
    loginValidation,
    getAllUserValidation
} from "../../middlewares/validators/user.validators";



const router = express.Router();

// @route   POST /sudoregister
// @desc    Sudo register
// @access  Private
// admin only access for creating new users where that user can be an admin or any other regular user
// difference is that sudo register accepts user access levels as params {admin, user, banned, moderator}
// flow goes like this:
// 1. user sends a request to /sudoregister
// 2. server checks if the user is logged in
// 3. if user is logged in, server checks if the user is an admin
// 4. if user is an admin, server checks if params are valid
// 5. if params are valid, server creates a new user with the given params

router.post("/registerAdmin",

    registrationValidation,
    SUDOOptionalUserAccessLevel,
    SUDO_REGISTER);
// router.post("/register",

//     registrationValidation,
//     SUDOOptionalUserAccessLevel,
//     SUDOMiddleware,
//     SUDO_REGISTER);

// router.post("/login", loginValidation, rememberMe, removeOldSession
//     , passport.authenticate('local', { failureRedirect: 'unauthorized', failureFlash: true }), connectEnsureLogin.ensureLoggedIn("loginerror"),
//     userProfile);


router.post("/login", loginValidation, removeOldSession, rememberMe
    , function (req: Request, res: Response, next: NextFunction) {
        passport.authenticate('local', function (err: any, user: any, info: any) {
            if (err) {
                console.log("err", err);

                return next(err);
            }
            if (!user) {
                console.log("user", user);

                return res.send({ message: "Invalid User Or Password", error: true });
            }
            // console.log("info",user)
            // // Function to clear existing user sessions

            // Clear any existing sessions for the user
            clearExistingUserSessions(user.id).then(() => {
                console.log("user.id", user.id)
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
    userProfile);




router.post("/register", verifyToken, registrationValidation, registerMiddleware, SUDOMiddleware, regularRegister);

router.get("/logout", verifyToken, async function (req, res) {
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
    } catch (error:any) {
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

router.post("/getAuthenticatedUser", verifyToken, getUserDetails);



router.get("/logoutsuccess", function (req, res) {
    res.status(200).send({
        message: "You have been logged out"
    });
})

router.post("/resetPasswordRequest",
    resetPassRequestValidation,
    resetPassRequestMiddleWare,
    resetPasswordRequest);
//this is what our frontend client will use
//to call the server and get the user to change their password
router.get("/verifyToken/", verifyToken);

// router.post("/resetPassword", verifyToken, resetPasswordValidation, resetPasswordMiddleware, resetUserPass);
router.post("/resetPassword", verifyToken, resetPasswordValidation, resetUserPass);
router.post("/adminResetPassword", verifyToken, resetPasswordValidation, adminResetUserPass);
router.post("/userDetails", verifyToken, getUserDetailsByUserID);

export default router;