import { Request, Response, NextFunction } from 'express';
import { IUser } from "../../interfaces/IUser"
import { getAllUser, updateAvatar, updateStatus, deleteUser, updateUser } from '../../services/auth.service';

import convertAccess from '../../utils/convertAcces';
import jwt from 'jsonwebtoken';
import * as _ from "lodash";
import { appConfig } from '../../config/appConfig';


export async function userProfile(req: Request, res: Response, next: NextFunction) {
    let user = req.user as IUser;
    //get id from req.sessionID
    console.log("req.user => ",req.user)
    if (!user.isActivated) {
        return res.status(400).send({
            message: "Your Account is Deactivated",
            error: true,
        });

    }
    console.log("After => ",req.user)

    return res.status(200).send({
        token: jwt.sign({ user:req.user, session: req.sessionID }, appConfig.jwtSecret ? appConfig.jwtSecret : ""),
        verified: true,
        message: "successful login",
        // user: user,
        session: req.sessionID,
        access: await convertAccess(user.userAccess)
    });
}

export async function getAllUserList(req: Request, res: Response, next: NextFunction) {
    const pageNo = _.get(req.body, "pageNo", 1);
    const pageLimit = _.get(req.body, "pageLimit", 20);

    try {
        const list = await getAllUser({ pageNo, pageLimit });

        if (list.error) {
            res.status(400).send(list);
        } else {
            res.status(200).send(list);
        }
    } catch (err) {
        res.status(400).send(err);
    }
}


export async function uploadAvatar(req: Request, res: Response, next: NextFunction) {

    console.log("req.file", req.file)
    const username = _.get(req.body, "username", "");
    let avatar = "" + _.get(req.file, "filename", "");

    if (username == "" || avatar == "") {
        res.status(400).send({
            "message": username == "" ? "User Name is required" : "File is required", error: true,
        });

    }
    avatar = "profile-avatar/" + avatar;
    try {
        const response = await updateAvatar({ username, avatar } as IUser);
        if (response.error) {
            res.status(400).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (err) {
        res.status(400).send(err);
    }
}


export async function statusChange(req: Request, res: Response, next: NextFunction) {

    // console.log("req.body", req.body)
    const username = _.get(req.body, "username", "");
    const isActivated = _.get(req.body, "isActivated", true);


    try {
        const response = await updateStatus({ username, isActivated } as IUser);
        if (response.error) {
            res.status(400).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (err) {
        res.status(400).send(err);
    }
}

export async function deleteUserRecord(req: Request, res: Response, next: NextFunction) {

    const username = _.get(req.body, "username", "");


    try {
        const response = await deleteUser({ username } as IUser);
        if (response.error) {
            res.status(400).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (err) {
        res.status(400).send(err);
    }
}


export async function updatedUserDetails(req: Request, res: Response, next: NextFunction) {

    const username = _.get(req.body, "username", "");
    const email = _.get(req.body, "email", "");
    const isActivated = _.get(req.body, "isActivated", true);
    const accessLevels = _.get(req.body, "accessLevels", []);
    const firstName = _.get(req.body, "firstName", "");
    const lastName = _.get(req.body, "lastName", "");


    try {
        const response = await updateUser({ username, email, isActivated, accessLevels, firstName, lastName } as IUser & { accessLevels: string[] });
        if (response.error) {
            res.status(400).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (err) {
        res.status(400).send(err);
    }
}
