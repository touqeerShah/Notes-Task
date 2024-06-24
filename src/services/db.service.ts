import mongoose from "mongoose";
import * as _ from "lodash";
import "reflect-metadata"
import { DataSource } from "typeorm"
import { config } from '../config/config';
import { Pool } from 'pg';


import { PostgresDB } from "./../interfaces/IConfig"
export
    const connectMongoDB = async (dsn: string) => {
        // console.log("dsn", dsn)
        mongoose
            .connect(dsn)
            .then(() => console.log("mongoDB Connected"))
            .catch((err) => console.log(err));
    };
let postgresDB: PostgresDB = config.postgresDB


export function connectToPG() {
    const client = new Pool({
        host: _.get(postgresDB, "host", "localhost"),
        port: _.get(postgresDB, "port", 5432),
        user: _.get(postgresDB, "username", "admin"),
        password: _.get(postgresDB, "password", "password"),
        database: _.get(postgresDB, "database", "stada"),
    });

    // await client.connect();
    return client;
    // .   .. your database operations ...

    // await client.end();
}