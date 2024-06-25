import mongoose from "mongoose";
import * as _ from "lodash";
import "reflect-metadata"
import { dbConfig } from '../config/dbConfig';


export
    const connectMongoDB = async () => {
        // console.log("dsn", dsn)
        const dsn = "mongodb://" + dbConfig.mongoUser + ":" + dbConfig.mongoPassword + "@" + dbConfig.mongoAddress + ":" + dbConfig.mongoPort + "/" + dbConfig.mongoDatabase;
        mongoose
            .connect(dsn)
            .then(() => console.log("mongoDB Connected"))
            .catch((err) => console.log(err));
    };