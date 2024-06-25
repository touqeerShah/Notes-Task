import { check, validationResult } from 'express-validator';

// Validation for creating a task
export const createTaskValidation = [
    check('title', 'Title is required').not().isEmpty().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    check('dueDate', 'Due date must be a valid date').optional().isISO8601(),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),
];

// Validation for updating a task
export const updateTaskValidation = [
    check('_id', 'Task ID is required').not().isEmpty().isMongoId().withMessage('Task ID must be a valid MongoDB ID'),

    check('title', 'Title is required').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    check('status', 'Status must be one of "pending", "in-progress", or "completed"').optional().isIn(['pending', 'in-progress', 'completed']),
    check('dueDate', 'Due date must be a valid date').optional().isISO8601(),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

];

// Validation for getting task details
export const getTaskDetailsValidation = [
    check('_id', 'Task ID is required').not().isEmpty().isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

];

// Validation for filtering tasks
export const filterTaskValidation = [
    check('pageNo', 'Page number must be a positive integer').optional().isInt({ min: 1 }),
    check('pageLimit', 'Page limit must be a positive integer').optional().isInt({ min: 1 }),
    check('status', 'Status must be one of "pending", "in-progress", or "completed"').optional().isIn(['pending', 'in-progress', 'completed']),
    check('startDate', 'Start date must be a valid date').optional().isISO8601(),
    check('endDate', 'End date must be a valid date').optional().isISO8601(),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

];

// Validation for changing task status
export const changeStatusValidation = [
    check('_id', 'Task ID is required').not().isEmpty().isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
    check('status', 'Status must be one of "pending", "in-progress", or "completed"').not().isEmpty().isIn(['pending', 'in-progress', 'completed']),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

];

// Validation for deleting a task
export const deleteTaskValidation = [
    check('_id', 'Task ID is required').not().isEmpty().isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

];
