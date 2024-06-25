import User from "../models/user/user.model";
import {
    IReturnRegister,
    IUser,
} from "../interfaces/IUser";

import Session from "./../models/sessions"
import { ISessions } from "./../interfaces/ISessions"

import ResetToken from "../models/resetToken";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/appConfig";
import { IToken, Decoded } from "./../interfaces/IToken";

let jwtSecret = appConfig.jwtSecret ? appConfig.jwtSecret : "";


export const regularRegister = async ({
    username,
    password,
    email,
    firstName,
    lastName,
}: IUser & { password: string }): Promise<IReturnRegister> => {
    try {


        //check if user exists by email or username
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }],
        });
        if (user) {
            return {
                message: "User already exists",
                error: true,
                user: undefined,
            };
        }


        //mongoose-local-passport will hash the password and handle it when we register the user
        //create a new user
        const newUser = new User({
            email,
            username,
            firstName,
            lastName
        });
        //register the user

        let registeredUser = await User.register(newUser, password);
        if (registeredUser) {

            return {
                message: "User registered",
                error: false,
                user: {
                    "email": registeredUser.email,
                    "username": registeredUser.username,
                    "firstName": registeredUser.firstName,
                    "lastName": registeredUser.lastName,
                    "isActivated": registeredUser.isActivated,
                    "_id": registeredUser._id
                } as IUser,
            };
        } else {
            return {
                message: "error registering user",
                error: true,
                user: undefined,
            };
        }
    } catch (error: any) {
        return {
            user: undefined,
            message: error,
            error: true,
        };
    }
};

export const generateJWTToken = (payload: any) => {



    let token = jwt.sign(payload, jwtSecret, { expiresIn: '30m' });
    return token;
};

export const resetPassword = async ({
    password,
    username
}: IUser & { password: string }): Promise<IReturnRegister> => {


    try {

        let userToReset = await User.findOne({ username: username });
        // console.log("userToReset", userToReset);

        if (!userToReset) {
            return {
                user: undefined,
                message: "user not found",
                error: true
            }
        } else
            userToReset.setPassword(password, (err) => {
                console.log("err", err)
                if (err) {
                    return {
                        message: "error resetting password",
                        error: true
                    }
                }
                userToReset && userToReset.save();
            });
        return {
            user: undefined,
            message: "password successfully reset",
            error: false
        }
    } catch (error: any) {
        return {
            user: undefined,
            message: error,
            error: true,
        };
    }
}

export const login = async ({
    password,
    username
}: IUser & { password: string }): Promise<IReturnRegister> => {


    try {

        let userToReset = await User.findOne({ username: username });
        // console.log("userToReset", userToReset);

        if (!userToReset) {
            return {
                user: undefined,
                message: "user not found",
                error: true
            }
        } else
            userToReset.setPassword(password, (err) => {
                console.log("err", err)
                if (err) {
                    return {
                        message: "error resetting password",
                        error: true
                    }
                }
                userToReset && userToReset.save();
            });
        return {
            user: undefined,
            message: "password successfully reset",
            error: false
        }
    } catch (error: any) {
        return {
            user: undefined,
            message: error,
            error: true,
        };
    }
}
//this will be used to create a new reset token for our user
//middle ware will handle the user validation
export const createResetToken = async ({
    email,
    username,
}: {
    email?: string;
    username?: string;
}) => {
    //check if the user exists by email or username
    let user: IUser | null = null;
    if (email) {
        user = await User.findOne({ email: email });
    } else if (username) {
        user = await User.findOne({ username: username });
    }
    if (!user) {
        return {
            error: true,
        };
    }
    //check if an existing reset token exists for the user
    let resetToken = await ResetToken.findOne({ user: user._id });
    if (resetToken) {
        //if the token exists we will delete it and create a new one
        await resetToken.deleteOne({ resetToken });
    }
    //create a new reset token
    let newResetToken = new ResetToken({
        user: user._id,
        resetToken: generateJWTToken(user),
        createdAt: new Date(),
    });
    //save the new reset token
    console.log("saving new reset token");
    console.log(newResetToken);
    await newResetToken.save();

    return {
        resetToken: newResetToken.resetToken,
    };
};

export const verifyJWTToken = (token: string) => {
    // console.log("decoding token");
    try {
        let decoded = jwt.verify(token, jwtSecret);
        // console.log("decoded token");
        // console.log(decoded, decoded as Decoded);
        return {
            error: false,
            decoded: decoded as Decoded,
        } as IToken;
    } catch (err: any) {
        console.log("error decoding token");
        console.log(err);
        return {
            error: true,
            decoded: undefined,
            message: err.message,
        } as IToken;
    }
};


export async function clearExistingUserSessions(userId: any) {
    try {
        const sessions = await Session.find(); // fetch all sessions

        const promises = sessions.map((sessionDocument: any) => {
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



export async function isSessionExist( sessionId: any): Promise<boolean> {
    try {
        console.log("sessionId",sessionId)
        const sessionDocument = await Session.findById(sessionId);

        if (!sessionDocument) {
            // Session does not exist
            return false;
        }
        return true;
    }
    catch (error) {
        return false;
    }
}