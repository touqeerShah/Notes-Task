import { adminRegistersUser, resetPassword, getAllUser, isAdmin } from '../../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import convertAccess from '../../utils/convertAcces';
import { createResetToken, verifyJWTToken } from '../../services/auth.service';
import User from '../../models/user/userModel';
import ResetToken from '../../models/ResetToken/ResetToken';
import { validationResult } from 'express-validator';
import {IToken} from "../../interfaces/IToken"

export async function SUDO_REGISTER(req: Request, res: Response, next: NextFunction) {
    const { username, password, email, firstName, lastName, accessLevels } = req.body;
    let user;
    try {


        if (!accessLevels) { user = await adminRegistersUser({ username, password, email, firstName, lastName }); }
        else { user = await adminRegistersUser({ username, password, email, accessLevels, firstName, lastName, }); }
        res.status(200).send(user);
    } catch (error: any) {
        console.log("error = = = = ", error);

        res.status(400).send({ status: 400, message: error.message })
    }
}
export async function getUserDetails(req: Request, res: Response, next: NextFunction) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    console.log("req.body.username", req.body.loginUser.user.username)
    let potentialUser = await User.findOne({ username: req.body.loginUser.user.username });
    if (potentialUser) {
        return res.status(200).json({
            message: 'Success',
            error: false,
            UserDetails: potentialUser
        });
    } else {
        return res.status(200).json({
            message: 'user not exists',
            error: true,
            UserDetails: undefined
        });
    }
}
export async function getUserDetailsByUserID(req: Request, res: Response, next: NextFunction) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    console.log("req.body.username", req.body._id)
    let potentialUser = await User.findOne({ _id: req.body._id });
    if (potentialUser) {
        return res.status(200).json({
            message: 'Success',
            error: false,
            UserDetails: potentialUser
        });
    } else {
        return res.status(200).json({
            message: 'user not exists',
            error: true,
            UserDetails: undefined
        });
    }
}


export async function regularRegister(req: Request, res: Response, next: NextFunction) {
    const { username, password, email, firstName, lastName } = req.body;
    const accessLevels = ["user"]
    console.log("received request to register user: ", username, password, email);
    let registered = await adminRegistersUser({ username, password, email, accessLevels, firstName, lastName });
    //login the user
    let count: number = await User.countDocuments({});

    if (registered.error) {
        res.status(400).send(registered);
    } else {
        let returnUser = registered.user ? registered.user : undefined;
        if (!returnUser) {
            res.status(404).send("User Don't Exists");
        } else {
            // need to login the user as well
            req.login(returnUser, async (err) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    let accessConverted = await convertAccess(returnUser?.userAccess);
                    console.log("access converted is " + accessConverted);
                    res.status(200).send({
                        message: "User registered successfully",
                        verified: true,
                        user: {
                            id: count === undefined ? 0 : count++,
                            username: returnUser?.username,
                            email: returnUser?.email,
                            accessLevels: accessConverted,
                        }
                    });
                }
            });
        }
    };
}

//request to get reset password link
export async function resetPasswordRequest(req: Request, res: Response, next: NextFunction) {
    const { email, username } = req.body;

    if (email) {
        //if the user supplied an email  
        let resetToken = await createResetToken({ email: email });
        if (resetToken.error) {
            res.status(400).send({ message: "Error creating reset token", });
        } else {
            //send the email link here
            // @audit-info need to add changes
            // sendResetLink({ email: email, tokenString: resetToken.resetToken });
            res.status(200).send({ message: "if the user exists, an email will be sent to them" });
        }

    } else if (username) {
        //if the user supplied a username
        let resetToken = await createResetToken({ username: username });
        //find the users email
        let user = await User.findOne({ username: username });
        let usersEmail = user?.email;
        if (resetToken.error) {
            res.status(400).send(resetToken);
        } else {
            //send the email link here
            // @audit-info need to add changes

            // sendResetLink({ email: usersEmail, tokenString: resetToken.resetToken });
            res.status(200).send({
                message: "if the user exists, an email will be sent to them"
            });
        }

    }
}

//used by the UI to display the form or redirect if reset token is invalid
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    // headers: {
    //     'Authorization': `Bearer ${sessionID}` // You can use any header name you prefer
    //   }


    let token = req.headers.authorization?.split(" ")[1];
    // console.log("header", req.headers);

    // const { resetToken } = req.params;
    // console.log("received request to verify  token: ", token);
    let verified: IToken = verifyJWTToken(token ? token : "");
    // console.log("verified", verified);

    if (verified.error) {
        return res.status(400).send({
            error: true,
            message: "invalid token or token expired"
        });
    }
    // console.log("req.sessionStore", req.sessionStore)
    if (verified.decoded && verified.decoded.session) {
        req.body.loginUser = verified.decoded
        req.user= req.body.loginUser.user;
        console.log("req.body.loginUser",req.isAuthenticated())
        if(!req.isAuthenticated()){
            return res.status(400).send({
                verified: true,
                message: "Session Expired expired!",
                tokenData: {}
            });
        }else{
            req.user={}
            next();
            return;
        }


    } else {
        return res.status(400).send({
            error: true,
            message: "please Login first"
        });
    }


}

//used to reset the password
//middlewares will check if the token is valid
//if all is valid, the user will be retrieved from the mongoDB
//and attached to the request body
export async function resetUserPass(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;
    // console.log("received request to reset password for user: ", req.body.loginUser.user.username);

    try {
        const updated = await resetPassword({ user: req.body.loginUser.user.username, newPassword: password });

        if (updated.error) {
            res.status(400).send(updated);
        } else {
            res.status(200).send(updated);
        }
    } catch (err) {
        res.status(400).send(err);
    }
}
export async function adminResetUserPass(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;
    // console.log("received request to reset password for user: ", req.body.loginUser.user);
    try {
        let checkIsAdmin = await isAdmin({ username: req.body.loginUser.user.username })
        // console.log("checkIsAdmin", checkIsAdmin)
        if (!checkIsAdmin.isAdmin) {
            res.status(403).send(checkIsAdmin);
        } else {
            const updated = await resetPassword({ user: req.body.username, newPassword: password });

            if (updated.error) {
                res.status(400).send(updated);
            } else {
                res.status(200).send(updated);
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
}

