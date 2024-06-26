import { taskModel } from "../models/";
import * as _ from "lodash";
import {convertToEndOfDay} from "../utils/date.conveter"
import {
    IReturn,
    ITask,
    IGetAllPagination,
    IDelete,
    IQuery,
} from "../interfaces/ITask";

//this will be used to create a new user by the admin or a user
//we include the access levels for the function that are optional
//in our middlewares we will check if the user has the right access level if needed
export const createTask = async ({
    title,
    description,
    status,
    dueDate,
    createdBy,
}: ITask): Promise<IReturn> => {
    try {
        console.log(title,
            description,
            status,
            dueDate,
            createdBy)
        let newTask = new taskModel({
            title,
            description,
            status,
            dueDate,
            createdBy,
        });
        //register the user
        newTask = await newTask.save();
        if (newTask) {
            return {
                results: newTask,
                message: "Success",
                error: false,
            };
        } else {
            return {
                results: undefined,
                message: "error registering bookmark",
                error: true,
            };
        }
    } catch (error: any) {
        return {
            results: undefined,
            message: error,
            error: true,
        };
    }
};
export const updateTask = async ({
    _id,
    title,
    description,
    status,
    dueDate,
    createdBy,
}: ITask): Promise<IReturn> => {
    try {
        
        const task = await taskModel.findOne({ _id, createdBy });

        if (!task) {
            return {
                message: task ? "No Permission" : "Task not found",
                error: true,
                results: undefined,
                pageTotal: 0,
            };
        }
      
        
        const updatedTask = await taskModel.findByIdAndUpdate(
            _id,
            { title, description, status, dueDate },
            { new: true }
        );
        if (!updatedTask) {
            return {
                message: "Task not found",
                error: true,
                results: undefined,
                pageTotal: 0,
            };
        }

        return {
            message: "Task updated successfully",
            error: false,
            results: updatedTask,
            pageTotal: 1,
        };
    } catch (error: any) {
        return {
            results: undefined,
            message: error,
            error: true,
        };
    }
};

export const getTaskDetails = async ({
    _id,
    createdBy,
}: ITask): Promise<IReturn> => {
    try {
        const task = await taskModel.find({_id:_id, createdBy});
        console.log("task",task)
        if (task.length==0) {
            return {
                message: "Task not found",
                error: true,
                results: undefined,
                pageTotal: 0,
            };
        }
        return {
            message: "Task details retrieved successfully",
            error: false,
            results: task,
            pageTotal: 1,
        };
    } catch (error: any) {
        return {
            results: undefined,
            message: error,
            error: true,
        };
    }
};

export const filterTask = async ({
    pageNo,
    pageLimit,
    status,
    startDate,
    endDate,
    createdBy,
}: IGetAllPagination): Promise<IReturn> => {
    try {
        const limit = pageLimit || 10;
        const page = pageNo || 1;
        const query: any = {};
        if (status) query.status = status;
        if (startDate) query.createdAt = { $gte: new Date(startDate) };
        if (endDate) {
            query.createdAt = { ...query.createdAt, $lte: convertToEndOfDay(endDate)};
        }
        if (createdBy) query.createdBy = createdBy;
        const tasks = await taskModel
            .find(query)
            .limit(limit)
            .skip((page - 1) * limit);
        const totalTasks = await taskModel.countDocuments(query);
        return {
            message: "Tasks filtered successfully",
            error: false,
            results: tasks as ITask[],
            pageTotal: Math.ceil(totalTasks / limit),
            currentPage: page,
        };
    } catch (error: any) {
        return {
            results: undefined,
            message: error,
            error: true,
        };
    }
};

export const changeStatus = async ({
    _id,
    createdBy,
    status,
}: IQuery): Promise<IReturn> => {
    try {
        const updatedTask = await taskModel.findByIdAndUpdate(
            { _id, createdBy },
            { status },
            { new: true }
        );
        if (!updatedTask) {
            return {
                message: "Task not found",
                error: true,
                results: undefined,
                pageTotal: 0,
            };
        }
        return {
            message: "Task status changed successfully",
            error: false,
            results: updatedTask,
            pageTotal: 1,
        };
    } catch (error: any) {
        return {
            results: undefined,
            message: error,
            error: true,
        };
    }
};

export const deleteTask = async ({
    _id,
    createdBy,
}: IQuery): Promise<IReturn> => {
    try {
        const query: object = { _id: _id, createdBy: createdBy };

        let deleteResult: IDelete = await taskModel.deleteOne(query);

        if (deleteResult.deletedCount > 0) {
            return {
                results: undefined,
                message: "Success",
                error: false,
                deleteResult: deleteResult,
            };
        } else
            return {
                results: undefined,
                message: "User not found",
                error: true,
                deleteResult: deleteResult,
            };
    } catch (error: any) {
        return {
            results: undefined,
            message: error,
            error: true,
        };
    }
};
export const deleteAllTask = async ({
    createdBy,
}: IQuery): Promise<IReturn> => {
    try {
        const query: object = {  createdBy: createdBy };

        let deleteResult: IDelete = await taskModel.deleteMany(query);

        if (deleteResult.deletedCount > 0) {
            return {
                results: undefined,
                message: "Success",
                error: false,
                deleteResult: deleteResult,
            };
        } else
            return {
                results: undefined,
                message: "User not found",
                error: true,
                deleteResult: deleteResult,
            };
    } catch (error: any) {
        return {
            results: undefined,
            message: error,
            error: true,
        };
    }
};


