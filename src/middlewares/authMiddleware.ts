import { NextFunction } from "express";
import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import User from "../models/user/userModel";
import { IUser } from "../interfaces/IUser"
import Session from "./../models/Sessions/index"
import { ISessions } from "./../interfaces/ISessions"
import UserType from "../models/UserType/UserType";
import accessRIGHTS from "../models/UserType/config";
import { verifyJWTToken } from "../services/authService";
import ResetToken, { IResetToken } from "../models/ResetToken/ResetToken";

export function loginMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //make sure user exists
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'invalid email or password',
                    error: true
                });
            }
        });
}

export async function registerMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    console.log("req.body.username", req.body.username)
    let potentialUser = await User.findOne({ username: req.body.username });
    if (potentialUser) {
        return res.status(422).json({
            message: 'user already exists',
            error: true
        });
    }
    next();
}

export async function SUDOMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //check if user is admin
    //they should be logged in so we can get the user from the request
    const user = req.body.loginUser.user as IUser;
    let isAdmin = false;
    console.log("userRoles", user);
    let checkAdmin = await User.findOne({ username: user.username });
    if (!checkAdmin) {
        return res.status(422).json({
            message: 'Invalid Admin',
            error: true
        });
    }
    let loginUser = checkAdmin as IUser

    if (user) {
        let userRoles = loginUser.userAccess as string[]; //user.userAccess is an array of strings of mongoose object ids
        //check if any of these ids(which correspond to the type) match the admin role
        for (let roleId of userRoles) {
            let role = await UserType.findById(roleId);
            if (role && role.accessRights === accessRIGHTS.admin) {
                isAdmin = true;
            } else {
                return res.status(404).json({
                    message: 'User Don\'t Exist'
                });
            }
        }

    }
    if (!isAdmin) {
        return res.status(403).json({
            message: 'you are not authorized to perform this action'
        });
    }



    next();
}

export async function resetPassRequestMiddleWare(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //check if we got either a username or email and proceed accordingly
    let email = req.body.email;
    let username = req.body.username;
    //check if user exists in either case , handling email first if that is the case
    if (email) {
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(200).json({
                message: 'if the user exists, an email will be sent to them',
            });
        }
    } else if (username) {
        let user = await User.findOne({ username: username });
        if (!user) {
            return res.status(200).json({
                message: 'if the user exists, an email will be sent to them',
            });
        }
    }
    next();
}

export async function resetPasswordMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //get the token from the request
    let resetToken = req.body.resetToken;
    //check if the token is valid or expired
    let verified = verifyJWTToken(resetToken);
    if (verified.error) {
        return res.status(422).json({
            message: 'invalid or expired token',
            error: true
        });
    }
    //check if the token exists in the mongoDB
    let verifiedResetToken = await ResetToken.findOne({ resetToken: resetToken }) as IResetToken;
    if (!verifiedResetToken) {
        return res.status(422).json({
            message: 'invalid token',
            error: true
        });
    }
    //can add any other checks here if needed such as 
    //checking if the user exists in the mongoDB
    //checking the ip address of the user who requested the reset
    //checking the region etc, can also check and add previous passwords
    //to the user model if needed and prevent the user from using the same password
    //here would be a good check for that if implementing
    let userID = verifiedResetToken.user;
    req.body.user = userID;

    next();
}

export async function rememberMe(req: Request, res: Response, next: NextFunction) {
    if (req.body.remember) {
        console.log('remember me');
        var oneWeek = 7 * 24 * 60 * 60 * 1000;
        req.session.cookie.expires = new Date(Date.now() + 60 * 60 * 2 * 1000 + oneWeek);
        req.session.cookie.maxAge = oneWeek;
    }
    next();
}
export async function  clearExistingUserSessions  (userId: any)  {
    try {
        const sessions = await Session.find(); // fetch all sessions

        const promises = sessions.map((sessionDocument:any) => {
            const session = sessionDocument.toObject() as ISessions;

            // console.log("= > ", session.session);

            const sessionData = JSON.parse(session.session);

            if (sessionData.passport && sessionData.passport.user.id === userId) {
                // If the session belongs to the current user, delete it
                // console.log("here", session._id)
                return Session.deleteOne({ _id: session._id });
            } else {
                // Otherwise, do nothing
                return Promise.resolve();
            }
        });

        // Wait for all delete operations (if any) to complete
        await Promise.all(promises);

    } catch (error) {
        console.error('Error clearing existing sessions:', error);
        throw error;
    }
};

export async function removeOldSession(req: Request, res: Response, next: NextFunction) {
    // console.log('req.session', req.isAuthenticated())
    req.logout((err: any) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: "Session have some Issues please Try again" });
        } else {
            // req.session.destroy((err) => {
            //     if (err) {
            //         res.status(500).send({ message: err });
            //     }
            // });
            // next();

        }
    });
    next();
}