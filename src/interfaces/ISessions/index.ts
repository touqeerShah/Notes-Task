
import { Document } from "mongoose";

export interface ISessions extends Document {
    _id: string; // or some other type, depending on how your IDs are structured
    session: string;
    expires: any;
}


