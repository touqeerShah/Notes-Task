import { Request, Response, NextFunction } from 'express';
import { IUser, IReturn } from "../../interfaces/IUser"
import {
    statusChange, getUserDetails, deleteMyAccount, updateUserDetails
} from '../../services/user.service';
import * as _ from "lodash";



export async function userAPIRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const username = req.body.loginUser.user.username;
    const email = _.get(req.body, "email", "pending");
    const firstName = _.get(req.body, "firstName", Date.now());
    const lastName = _.get(req.body, "lastName", undefined);
    const isActivated = _.get(req.body, "isActivated", true);

    const functionName = _.get(req.body, "functionName", "");

    try {
        let response: Partial<IReturn> = {};
        if (functionName)
            switch (functionName) {
                case "statusChange":
                    response = await statusChange({
                        username,
                        isActivated
                    } as IUser & { password: string });
                    break;
                case "updateUserDetails":
                    response = await updateUserDetails({
                        username, email, firstName, lastName
                    } as IUser);
                    break;
                case "deleteMyAccount":
                    response = await deleteMyAccount({
                        username
                    } as IUser);
                    break;
                case "getUserDetails":
                    response = await getUserDetails({
                        username
                    } as IUser);
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
