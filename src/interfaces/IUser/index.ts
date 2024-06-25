
import { PassportLocalDocument, Document } from "mongoose";

export interface IUserType extends Document {
    accessRights: string;
}
export interface IResetToken extends Document {
    resetToken: string;
    user: string;
    createdAt: Date;

}
export interface IUser extends PassportLocalDocument {
    userAccess: IUserType["_id"];
    _id:string
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    isActivated: boolean
}


export interface IDelete {
    acknowledged: boolean,
    deletedCount: number
}

export interface IReturnRegister {
    user: IUser | undefined;
    error: boolean;
    message: string;
}

//return of the reset function
export interface IReturnReset {
    error: boolean;
    message: string;
    isAdmin?: boolean
}
export interface IReturnEventRes {
    error: boolean;
    message: string;
    isEventService?: boolean
}
export interface IGetAllPagination {

    pageNo: number,
    pageLimit: number
}
export interface IReturn {
    users?: IUser | IUser[] | undefined;
    error: boolean;
    message: string;
    noOfUser?: number;
    deleteResult?: IDelete

}
