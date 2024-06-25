import { Request, Response, NextFunction } from 'express';
import { isSessionExist, verifyJWTToken } from '../../services/auth.service';
import { IToken } from "../../interfaces/IToken"
import {
    IReturnRegister,
    IUser,
} from "../../interfaces/IUser";
import {
    regularRegister,
    resetPassword,
    generateJWTToken,
} from "../../services/auth.service";
export { clearExistingUserSessions } from "../../services/auth.service";

import * as _ from "lodash";





export async function authAPIRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // console.log(req.body.loginUser._id)
    const username = _.get(req.body, 'loginUser.user.username', '');
    const password = _.get(req.body, "password", "").toLowerCase();

    const functionName = _.get(req.body, "functionName", "");

    try {
        let response: Partial<IReturnRegister> = {};
        if (functionName)
            switch (functionName) {

                case "resetPassword":
                    response = await resetPassword({
                        username: username,
                        password,
                    } as IUser & { password: string });
                    break;

                default:
                    res
                        .status(400)
                        .send({
                            message: "Invalid Function Name",
                            error: true,
                            company: undefined,
                        });
            }
        // console.log("response", response);

        if (response && response.error) {
            res.status(400).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (error: any) {
        res.status(400).send({ status: 400, message: error.message });
    }
}




export async function logoutOldSession(req: Request, res: Response, next: NextFunction) {
    // console.log('req.session', req.isAuthenticated())
    req.logout((err: any) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: "Session have some Issues please Try again" });
        }
    });
    next();
}

export async function register(req: Request, res: Response, next: NextFunction) {
    console.log(">>>>> register <<<<")
    const username = _.get(req.body, "username", "").toLowerCase();
    const password = _.get(req.body, "password", "").toLowerCase();
    const email = _.get(req.body, "email", "pending");
    const firstName = _.get(req.body, "firstName", Date.now());
    const lastName = _.get(req.body, "lastName", undefined);

    const response = await regularRegister({
        username,
        password,
        email,
        firstName,
        lastName,
    } as IUser & { password: string });
    res.send(response);
}
//use


export async function getUserProfile(req: Request, res: Response, next: NextFunction) {
    let user = req.user as IUser;
    if (!user.isActivated) {
        return res.status(400).send({
            message: "Your Account is Deactivated",
            error: true,
        });

    }
    return res.status(200).send({
        token: `Bearer ` + generateJWTToken({
            user: {
                email: user.email,
                username: user.username,
                isActivated: user.isActivated
            }, session: req.sessionID
        }),
        verified: true,
        message: "successful login",
        session: req.sessionID,
    });
}
//used by the UI to display the form or redirect if reset token is invalid
export async function verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
            message: "invalid token or token expired",
        });
    }
    // console.log("req.sessionStore", req.sessionStore)
    if (verified.decoded && verified.decoded.session) {
        req.body.loginUser = verified.decoded;
        const sessionId = req.body.loginUser.session
        const isSessionActive = await isSessionExist( sessionId )
        console.log(isSessionActive)
        req.user = req.body.loginUser.user;
        if (!req.isAuthenticated() || !isSessionActive) {
            return res.status(400).send({
                verified: true,
                message: "Session Expired expired!",
                tokenData: {},
            });
        } else {
            req.user = {};
            next();
            return;
        }
    } else {
        return res.status(400).send({
            error: true,
            message: "please Login first",
        });
    }
}