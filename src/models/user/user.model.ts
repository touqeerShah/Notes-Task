import { model, Schema } from "mongoose";
import emailValidator from 'email-validator';
const bcrypt = require('bcrypt');

import { IUser } from "../../interfaces/IUser"
import passportLocalMongoose from "passport-local-mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param email: string
 * @param username: string
 * @param userAccess: ref => [ UserType._id]
 * @param avatar: string
 */

//passport-local-mongoose will handle the password and hashing

// export interface IUser extends PassportLocalDocument {
//     userAccess: IUserType["_id"];
//     id: number;
//     email: string;
//     username: string;
//     avatar: string;

// }

const UserSchema = new Schema<IUser>({
    id: {
        type: Number,
        default: 0,
    },
    email: {
        type: String,
        required: true,
        index: { unique: true },
        trim: true,
        lowercase: true,
        validate: {
            validator: emailValidator.validate,
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,

    },
    firstName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,

    }, lastName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,

    },
     isActivated: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true  // This will add `createdAt` and `updatedAt` fields
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.index({ email: 1, username: 1 });

const User = model<IUser>("User", UserSchema);

export default User;