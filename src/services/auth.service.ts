import User from "../models/user/userModel";
import { IReturnRegister, IReturnReset, IReturnEventRes,IGetAllPagination, IReturn, IUser, IDelete } from "../interfaces/IUser"

import userTypeConfig from "../models/UserType/config";
import UserType from "../models/UserType/UserType";


import ResetToken from "../models/ResetToken/ResetToken";
import jwt from 'jsonwebtoken';
import { appConfig } from '../config/appConfig';
import { IToken, Decoded } from "./../interfaces/IToken"

let jwtSecret = appConfig.jwtSecret ? appConfig.jwtSecret : ""

//this will be used to create a new user by the admin or a user
//we include the access levels for the function that are optional
//in our middlewares we will check if the user has the right access level if needed
export const adminRegistersUser =
    //middlewares will check for admin access level
    async ({ email, password, username, accessLevels, firstName, lastName }
        : { email: string, password: string, username: string, accessLevels?: string[], firstName: string, lastName: string })
        : Promise<IReturnRegister> => {
        try {
            let newUsersAccessLevels = [];
            let firstUser = false;

            //check if the user already exists
            console.log("properties provided for registration", email, password, username, accessLevels);

            //check if user exists by email or username
            const user = await User.findOne({ $or: [{ email: email }, { username: username }] });
            if (user) {
                return {
                    message: "User already exists",
                    error: true,
                    user: undefined
                }
            };
            //if there are no users in the mongoDB, default first user to be admin
            let count = await User.countDocuments({});
            if (count === 0) {
                firstUser = true;
            };

            //accessLevels will be an array of strings
            //we will convert the strings to the access level object  
            if (!accessLevels || accessLevels.length === 0) {
                console.log("no access levels provided defaulting to user");
                //if the accessLevels is not provided we will assign the user to the default access level
                let defaultAccessLevel = await UserType.findOne({ accessRights: userTypeConfig.user });
                defaultAccessLevel && newUsersAccessLevels.push(defaultAccessLevel._id);
            } else {
                //if the accessLevels is provided we will convert the strings to the access level object
                for (let accessRight of accessLevels) {
                    console.log(accessRight + "access right sent in");
                    let accessLevel = await UserType.findOne({ accessRights: accessRight });
                    console.log("access level found is " + accessLevel);
                    accessLevel && newUsersAccessLevels.push(accessLevel._id);
                    console.log("access level pushed to array where array is " + newUsersAccessLevels);
                }
            }

            if (firstUser) {
                console.log("first user is being created");
                //if the user is the first user in the mongoDB, we will assign them the admin access level
                let adminAccessLevel = await UserType.findOne({ accessRights: userTypeConfig.admin });
                adminAccessLevel && newUsersAccessLevels.push(adminAccessLevel._id);
            }

            //mongoose-local-passport will hash the password and handle it when we register the user

            //generate avatar
            let avatar = "";
            let id = count === undefined ? 0 : count++;

            //create a new user
            const newUser = new User({
                id,
                email,
                username,
                firstName, lastName,
                userAccess: newUsersAccessLevels,
                avatar
            });
            //register the user
            let registeredUser = await User.register(newUser, password);
            let regobj = {
                id: registeredUser.id,
                email: registeredUser.email,
                username: registeredUser.username,
                userAccess: registeredUser.userAccess,
                firstName: registeredUser.firstName, lastName: registeredUser.lastName,
            }
            console.log(id, "user registered", count);
            console.log(regobj);
            if (registeredUser) {

                return {
                    message: "User registered",
                    error: false,
                    user: registeredUser
                }
            } else {
                return {
                    message: "error registering user",
                    error: true,
                    user: undefined
                }
            }
        } catch (error: any) {
            // console.log("error = = = = ", );

            throw new Error(error.message);
        }
    };

export const resetPassword = async ({
    user,
    newPassword,
}: { user: string, newPassword: string }): Promise<IReturnReset> => {
    //reset the users password
    // console.log(newPassword, "user?.userna÷me",);

    let userToReset = await User.findOne({ username: user });
    // console.log("userToReset", userToReset);

    if (!userToReset) {
        return {
            message: "user not found",
            error: true
        }
    } else
        userToReset.setPassword(newPassword, (err) => {
            console.log("err", err)
            if (err) {
                return {
                    message: "error resetting password",
                    error: true
                }
            }
            userToReset && userToReset.save();
        });
    console.log("password reset");
    return {
        message: "password successfully reset",
        error: false
    }

}

export const isAdmin = async ({
    username,
}: { username: string }): Promise<IReturnReset> => {
    //reset the users password

    let userToReset = await User.findOne({ username });
    console.log("userToReset", userToReset);

    if (!userToReset) {

        return {
            message: "No Permission !!",
            error: true,
            isAdmin: false

        }
    } else {
        let check = false
        for (let index = 0; index < userToReset?.userAccess.length; index++) {
            const element = userToReset?.userAccess[index];
            let defaultAccessLevel = await UserType.findOne({ _id: element });
            console.log("defaultAccessLevel", defaultAccessLevel?.accessRights)
            if (defaultAccessLevel?.accessRights == "admin") {
                check = true;
                break
            }
        }

        return {
            message: check ? "Is Admin" : "No Permisssion",
            error: !check,
            isAdmin: check && userToReset?.userAccess.length != 0

        }
    }
}

export const isEventService = async ({
    username,
}: { username: string }): Promise<IReturnEventRes> => {
    //reset the users password

    let userToReset = await User.findOne({ username });
    // console.log("userToReset", userToReset);

    if (!userToReset) {

        return {
            message: "No Permission",
            error: true,
            isEventService: false

        }
    } else {
        let check = false
        for (let index = 0; index < userToReset?.userAccess.length; index++) {
            const element = userToReset?.userAccess[index];
            let defaultAccessLevel = await UserType.findOne({ _id: element });
            // console.log("defaultAccessLevel", defaultAccessLevel?.accessRights)
            if (defaultAccessLevel?.accessRights == "event") {
                check = true;
                break
            }
        }

        return {
            message: check ? "Is Event Service" : "No Permisssion",
            error: !check,
            isEventService: check && userToReset?.userAccess.length != 0

        }
    }
}

export const getAllUser = async ({
    pageNo,
    pageLimit
}: IGetAllPagination): Promise<IReturn> => {

    const skipRecord = (pageNo - 1) * pageLimit;
    let noOfUser: number | null = await User.countDocuments({})


    let users: IUser[] | null = await User.find({})
        .limit(pageLimit)
        .skip(skipRecord).sort({ createdAt: 1 }).populate({
            path: 'userAccess',
            select: 'accessRights'  // selects only the `name` and `email` fields; excludes `_id`
            // ...other options
        });
    if (users) {
        return {
            message: "Success",
            error: false,
            users: users,
            noOfUser: noOfUser
        };
    } else
        return {
            message: "User not found",
            error: true,
            users: undefined,

        };

};

export const updateAvatar = async ({
    username, avatar
}: IUser): Promise<IReturn> => {
    const query: object = { username: username }

    let userToReset = await User.findOne(
        query
    );
    if (!userToReset) {
        return {
            message: "user not found",
            error: true,
            users: undefined
        }
    } else {
        try {
            let response: any = await User.updateOne(
                query,
                {
                    $set: {
                        avatar
                    }
                });

            return {
                message: "Success",
                error: false,
                users: undefined,
            };
        } catch (error: any) {
            return {
                message: error,
                error: true,
                users: undefined,

            };
        }
    }


};

export const updateStatus = async ({
    username, isActivated
}: IUser): Promise<IReturn> => {
    const query: object = { username: username }
    let userToReset = await User.findOne(
        query
    );
    if (!userToReset) {
        return {
            message: "user not found",
            error: true,
            users: undefined
        }
    } else {
        try {
            let response: any = await User.updateOne(
                query,
                {
                    $set: {
                        isActivated
                    }
                });

            return {
                message: "Success",
                error: false,
                users: undefined,
            };
        } catch (error: any) {
            return {
                message: error,
                error: true,
                users: undefined,

            };
        }
    }


};

export const deleteUser = async ({
    username
}: IUser): Promise<IReturn> => {
    const query: object = { username: username }



    let deleteResult: IDelete = await User.deleteOne(query);

    if (deleteResult.deletedCount > 0) {
        return {
            message: "Success",
            error: false,
            deleteResult: deleteResult,

        };
    } else
        return {
            message: "User not found",
            error: true,
            deleteResult: deleteResult,
        };


};


export const updateUser = async ({
    username, email, isActivated, firstName, lastName, accessLevels
}: IUser & { accessLevels: string[] }): Promise<IReturn> => {
    let newUsersAccessLevels = [];

    const query: object = { username: username }
    let userToReset = await User.findOne(
        query
    );
    if (!userToReset) {
        return {
            message: "user not found",
            error: true,
            users: undefined
        }
    } else {
        try {
            newUsersAccessLevels = userToReset.userAccess
            if (!accessLevels || accessLevels.length === 0) {
                console.log("no access levels provided defaulting to user");
                //if the accessLevels is not provided we will assign the user to the default access level
                // let defaultAccessLevel = await UserType.findOne({ accessRights: userTypeConfig.user });
                // defaultAccessLevel && newUsersAccessLevels.push(defaultAccessLevel._id);
            } else {
                //if the accessLevels is provided we will convert the strings to the access level object
                for (let accessRight of accessLevels) {
                    console.log(accessRight + "access right sent in");
                    let accessLevel = await UserType.findOne({ accessRights: accessRight });
                    console.log("access level found is ", accessLevel);
                    if (accessLevel) {

                        let alreadyExist = false
                        for (let index = 0; index < newUsersAccessLevels.length; index++) {
                            const element = newUsersAccessLevels[index];
                            console.log("element",element._id.toString() === accessLevel._id.toString())

                            if (element._id.toString() === accessLevel._id.toString()) {
                                alreadyExist = true;
                            }

                        }
                        if (!alreadyExist)
                            newUsersAccessLevels.push(accessLevel._id)
                    };
                    console.log("access level pushed to array where array is " + newUsersAccessLevels);
                }
            }
            console.log("newUsersAccessLevels", newUsersAccessLevels)
            let response: any = await User.updateOne(
                query,
                {
                    $set: {
                        email,
                        isActivated,
                        firstName, lastName,
                        userAccess: newUsersAccessLevels,

                    }
                });

            return {
                message: "Success",
                error: false,
                users: undefined,
            };
        } catch (error: any) {
            return {
                message: error,
                error: true,
                users: undefined,

            };
        }
    }

};

export const generateJWTToken = (user: IUser) => {
    let payload = {
        user: {
            id: user._id,
        }
    }
    let token = jwt.sign(payload, jwtSecret, { expiresIn: '30m' });
    return token;
};

//this will be used to create a new reset token for our user
//middle ware will handle the user validation
export const createResetToken = async ({ email, username }: { email?: string, username?: string }) => {
    //check if the user exists by email or username
    let user: IUser | null = null;
    if (email) {
        console.log("recieved email");
        user = await User.findOne({ email: email });
    } else if (username) {
        console.log("recieved username");
        user = await User.findOne({ username: username });
    }
    if (!user) {
        return {
            error: true
        }
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
        createdAt: new Date()
    });
    //save the new reset token
    console.log("saving new reset token");
    console.log(newResetToken);
    await newResetToken.save();

    return {
        resetToken: newResetToken.resetToken,
    }

};

export const verifyJWTToken = (token: string) => {
    // console.log("decoding token");
    try {
        let decoded = jwt.verify(token, jwtSecret);
        // console.log("decoded token");
        // console.log(decoded, decoded as Decoded);
        return {
            error: false,
            decoded: decoded as Decoded
        } as IToken
    } catch (err: any) {
        console.log("error decoding token");
        console.log(err);
        return {
            error: true,
            decoded:undefined,
            message: err.message
        } as IToken
    }
}