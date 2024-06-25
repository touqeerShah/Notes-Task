import { IUser, IReturn, IDelete } from "../interfaces/IUser";
import User from "../models/user/user.model";



export const statusChange = async ({
    username,
    isActivated,

}: IUser): Promise<IReturn> => {
    try {
        const query: object = { username: username };

        let response: any = await User.updateOne(
            query,
            {
                $set: { isActivated }
            }
        );

        // Return success response
        return {
            message: "Success",
            error: false,
            users: undefined,
        };
    } catch (error: any) {
        return {
            users: undefined,
            message: error,
            error: true,
        };
    }
}

export const getUserDetails = async ({
    username,


}: IUser): Promise<IReturn> => {
    try {
        const query: object = { username: username }
        const projection = { username:1,isActivated:1,email: 1, firstName: 1, lastName: 1, _id: 0 };

        let user = await User.findOne(
            query,
            projection
        );
        if (!user) {
            return {
                message: "user not found",
                error: true,
                users: undefined
            }
        } else {
            return {
                message: "success",
                error: false,
                users: user
            }
        }
    } catch (error: any) {
        return {
            users: undefined,
            message: error,
            error: true,
        };
    }
}


export const deleteMyAccount = async ({
    username,


}: IUser): Promise<IReturn> => {
    try {
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

    } catch (error: any) {
        return {
            users: undefined,
            message: error,
            error: true,
        };
    }
}




export const updateUserDetails = async ({
    username, email, firstName, lastName
}: IUser): Promise<IReturn> => {
    try {
        const query: object = { username: username }

        let response: any = await User.updateOne(
            query,
            {
                $set: {
                    email,
                    firstName, 
                    lastName,

                }
            });

        return {
            message: "Success",
            error: false,
            users: undefined,
        };

    } catch (error: any) {
        return {
            users: undefined,
            message: error,
            error: true,
        };
    }
}



