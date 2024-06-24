import { taskAPIRequest } from "../../controllers/task/task.controller";
const { oneOf, check } = require("express-validator");
import express, { Request, Response, NextFunction } from 'express';

import { verifyToken } from "../../controllers/user/auth.controller";
import { validationResult } from 'express-validator';

import {
    createTaskValidation,
    updateTaskValidation,
    getTaskDetailsValidation,
    filterTaskValidation,
    changeStatusValidation,
    deleteTaskValidation,
} from "../../middlewares/validators/task.validators";

const router = express.Router();
// Middleware to handle validation errors
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
router.post(
    "/taskAPIRequest",
    verifyToken,
    oneOf([
        [check("functionName").equals("createTask"), ...createTaskValidation],
        [check("functionName").equals("updateTask"), ...updateTaskValidation],
        [
            check("functionName").equals("getTaskDetails"),
            ...getTaskDetailsValidation,
        ],
        [check("functionName").equals("filterTask"), ...filterTaskValidation],
        [check("functionName").equals("changeStatus"), ...changeStatusValidation],
        [check("functionName").equals("deleteTask"), ...deleteTaskValidation],
    ]),
    handleValidationErrors,
    taskAPIRequest
);

export default router;
