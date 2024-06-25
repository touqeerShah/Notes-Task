import * as dotenv from 'dotenv';
import * as bunyan from 'bunyan';
import { IDBConfig } from '../interfaces/IDBConfig';

// Load environment variables from .env file
dotenv.config();

// Define logger configurations for different environments
const loggers = {
    development: () => bunyan.createLogger({ name: 'development', level: 'debug' }),
    production: () => bunyan.createLogger({ name: 'production', level: 'info' }),
    test: () => bunyan.createLogger({ name: 'test', level: 'fatal' }),
};

// Define configurations for different environments
const configurations: { [key: string]: IDBConfig } = {
    development: {
        mongoUser: process.env.DEV_MONGO_USER,
        mongoPassword: process.env.DEV_MONGO_PASS,
        mongoAddress: process.env.DEV_MONGO_ADDRESS,
        mongoDatabase: process.env.DEV_MONGO_PORT,
        mongoPort: Number(process.env.DEV_MONGO_PORT)
    },
    production: {
        mongoUser: process.env.PROD_MONGO_USER,
        mongoPassword: process.env.PROD_MONGO_PASS,
        mongoAddress: process.env.PROD_MONGO_ADDRESS,
        mongoDatabase: process.env.PROD_MONGO_PORT,
        mongoPort: Number(process.env.PROD_MONGO_PORT)

    },
    test: {
        mongoUser: process.env.TEST_MONGO_USER,
        mongoPassword: process.env.TEST_MONGO_PASS,
        mongoAddress: process.env.TEST_MONGO_ADDRESS,
        mongoDatabase: process.env.TEST_MONGO_PORT,
        mongoPort: Number(process.env.TEST_MONGO_PORT)
    },
};

// Determine the current environment
const environment = process.env.NODE_ENV || 'development';

// Get the configuration based on the current environment
const dbConfig: IDBConfig = configurations[environment];

export { dbConfig }