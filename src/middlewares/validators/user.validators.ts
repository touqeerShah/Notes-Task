import { check, oneOf } from 'express-validator';

export const registrationValidation = [

    check("username", "username is required").not().isEmpty().isLength({ min: 3 }).withMessage("username must be at least 3 characters long"),
    check("email", "email is required").not().isEmpty().isEmail().withMessage("email is invalid"),
    check("password", "password is required").not().isEmpty().isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
    check("firstName", "firstName is required").not().isEmpty().withMessage("firstName must be at least 6 characters long"),
    check("lastName", "lastName is required").not().isEmpty().withMessage("lastName must be at least 6 characters long"),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

];
export const updateUserValidation = [

    check("username", "username is required").not().isEmpty().isLength({ min: 3 }).withMessage("username must be at least 3 characters long"),
    check("email", "email is required").not().isEmpty().isEmail().withMessage("email is invalid"),
    check("firstName", "firstName is required").not().isEmpty().withMessage("firstName must be at least 6 characters long"),
    check("lastName", "lastName is required").not().isEmpty().withMessage("lastName must be at least 6 characters long"),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),
];

export const loginValidation = [
    check("username", "username is required").not().isEmpty(),
    check("password", "password is required").not().isEmpty(),
];



export const resetPassRequestValidation = [
    //check for email or username
    oneOf([
        check("email", "email is required").not().isEmpty().isEmail().withMessage("email is invalid"),
        check("username", "username is required").not().isEmpty().withMessage("username is invalid")
    ]),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

]

export const resetPasswordValidation = [
    check("password", "password is required").not()
        .isEmpty().isLength({ min: 6 }).
        withMessage("password must be at least 6 characters long"),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

]


export const getDetailValidation = [
    check("isActivated", "isActivated is required").not().isEmpty().withMessage("isActivated is invalid"),
    check("username", "username is required").not().isEmpty().withMessage("username is invalid"),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

]
export const statusChangeValidation = [
    check("isActivated", "isActivated is required").not().isEmpty().withMessage("isActivated is invalid"),
    check("username", "username is required").not().isEmpty().withMessage("username is invalid"),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

]

export const deleteUserRecordValidation = [
    //check for email or username
    check("username", "username is required").not().isEmpty().withMessage("username is invalid"),
    check("functionName", "functionName is required").not().isEmpty().withMessage("functionName is invalid"),

]