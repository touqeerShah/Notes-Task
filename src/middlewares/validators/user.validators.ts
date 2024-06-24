import { check, oneOf } from 'express-validator';

export const registrationValidation = [

    check("username", "username is required").not().isEmpty().isLength({ min: 3 }).withMessage("username must be at least 3 characters long"),
    check("email", "email is required").not().isEmpty().isEmail().withMessage("email is invalid"),
    check("password", "password is required").not().isEmpty().isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
    check("firstName", "firstName is required").not().isEmpty().withMessage("firstName must be at least 6 characters long"),
    check("lastName", "lastName is required").not().isEmpty().withMessage("lastName must be at least 6 characters long"),

    check("confirmPassword", "password confirmation is required").not().isEmpty().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    },
    )
];
export const updateUserValidation = [

    check("username", "username is required").not().isEmpty().isLength({ min: 3 }).withMessage("username must be at least 3 characters long"),
    check("email", "email is required").not().isEmpty().isEmail().withMessage("email is invalid"),
    check("firstName", "firstName is required").not().isEmpty().withMessage("firstName must be at least 6 characters long"),
    check("lastName", "lastName is required").not().isEmpty().withMessage("lastName must be at least 6 characters long"),


];

export const loginValidation = [
    check("username", "username is required").not().isEmpty(),
    check("password", "password is required").not().isEmpty(),
];

export const SUDOOptionalUserAccessLevel = [
    check("accessLevels", "accessLevels must be an array containing either admin, user, moderator, or banned").optional().isArray().custom((value, { req }) => {
        console.log("value", value[0])
        if (value.length > 0) {
            for (let i = 0; i < value.length; i++) {
                if (value[i] !== "admin" && value[i] !== "user" && value[i] !== "moderator" && value[i] !== "banned") {
                    throw new Error("accessLevels must be an array containing either admin, user, moderator, or banned");
                }
            }
        }
        return true;
    }
    ),
];

export const resetPassRequestValidation = [
    //check for email or username
    oneOf([
        check("email", "email is required").not().isEmpty().isEmail().withMessage("email is invalid"),
        check("username", "username is required").not().isEmpty().withMessage("username is invalid")
    ]),
]

export const resetPasswordValidation = [
    check("password", "password is required").not()
        .isEmpty().isLength({ min: 6 }).
        withMessage("password must be at least 6 characters long"),

]

export const getAllUserValidation = [
    check("pageNo", "pageNo is required").not().isNumeric().isEmpty().withMessage("pageNo is invalid"),
    check("pageLimit", "pageLimit is required").not().isNumeric().isEmpty().withMessage("pageLimit is invalid"),
];


export const uploadAvatarValidation = [
    //check for email or username
    check("username", "username is required").not().isEmpty().withMessage("username is invalid")

]

export const statusChangeValidation = [
    check("isActivated", "isActivated is required").not().isEmpty().withMessage("isActivated is invalid"),
    check("username", "username is required").not().isEmpty().withMessage("username is invalid")
]

export const deleteUserRecordValidation = [
    //check for email or username
    check("username", "username is required").not().isEmpty().withMessage("username is invalid")
]