import "reflect-metadata";

import { Request, Response, NextFunction } from "express";
import {
    IReturn,
    ITask,
    IGetAllPagination,
    IDelete,
    IQuery,
} from "../../interfaces/ITask";

import {
    createTask,
    updateTask,
    getTaskDetails,
    filterTask,
    changeStatus,
    deleteTask,
} from "../../services/task.service";

import * as _ from "lodash";

export async function taskAPIRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // console.log(req.body.loginUser._id)
    const createdBy = req.body.loginUser.user._id;
    const _id = _.get(req.body, "_id", "").toLowerCase();
    const title = _.get(req.body, "title", "").toLowerCase();
    const description = _.get(req.body, "description", "").toLowerCase();
    const status = _.get(req.body, "status", "pending");
    const dueDate = _.get(req.body, "dueDate", Date.now());
    const startDate = _.get(req.body, "startDate", undefined);
    const endDate = _.get(req.body, "endDate", undefined);
    const pageNo = _.get(req.body, "pageNo", 1);
    const pageLimit = _.get(req.body, "pageLimit", 20);

    const functionName = _.get(req.body, "functionName", "");
    try {
        let response: Partial<IReturn> = {};
        if (functionName)
            switch (functionName) {
                case "createTask":
                    response = await createTask({
                        title,
                        description,
                        status,
                        dueDate,
                        createdBy,
                    } as ITask);
                    break;
                case "updateTask":
                    response = await updateTask({
                        _id,
                        title,
                        description,
                        status,
                        dueDate,
                        createdBy
                    } as ITask);
                    break;

                case "getTaskDetails":
                    response = await getTaskDetails({
                        _id,
                        createdBy,
                    } as ITask);
                    break;
                case "filterTask":
                    response = await filterTask({
                        pageNo,
                        pageLimit,
                        status,
                        startDate,
                        endDate,
                        createdBy,
                    } as IGetAllPagination);
                    break;
                case "changeStatus":
                    response = await changeStatus({
                        _id,
                        createdBy,
                        status,
                    } as IQuery);
                    break;
                case "deleteTask":
                    response = await deleteTask({
                        _id,
                        createdBy,
                    } as IQuery);
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
