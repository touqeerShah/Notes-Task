import * as dotenv from 'dotenv';
import * as bunyan from 'bunyan';
import { IAppConfig } from '../interfaces/IAppConfig ';

// Load environment variables from .env file
dotenv.config();

// Define logger configurations for different environments
const loggers = {
    development: () => bunyan.createLogger({ name: 'development', level: 'debug' }),
    production: () => bunyan.createLogger({ name: 'production', level: 'info' }),
    test: () => bunyan.createLogger({ name: 'test', level: 'fatal' }),
};

// Define configurations for different environments
const configurations: { [key: string]: IAppConfig } = {
    development: {
        siteName: process.env.DEV_APP_NAME || "Notes APP",
        log: loggers.development,
        secret: process.env.DEV_SECRET || "another very secret 12345",
        jwtSecret: process.env.DEV_JWT_SECRET || "another very secret 12345",
        port: Number(process.env.DEV_PORT) || 3000,
        name: process.env.DEV_SESSIONID || "sessionId",
    },
    production: {
        siteName: process.env.PROD_APP_NAME || "Notes APP",
        log: loggers.development,
        secret: process.env.PROD_SECRET || "another very secret 12345",
        jwtSecret: process.env.PROD_JWT_SECRET || "another very secret 12345",
        port: Number(process.env.PROD_PORT) || 3000,
        name: process.env.PROD_SESSIONID || "sessionId",

    },
    test: {
        siteName: process.env.TEST_APP_NAME || "Notes APP",
        log: loggers.development,
        secret: process.env.TEST_SECRET || "another very secret 12345",
        jwtSecret: process.env.TEST_JWT_SECRET || "another very secret 12345",
        port: Number(process.env.TEST_PORT) || 3000,
        name: process.env.TEST_SESSIONID || "sessionId",
    },
};

// Determine the current environment
const environment = process.env.NODE_ENV || 'development';

// Get the configuration based on the current environment
const appConfig: IAppConfig = configurations[environment];

export { appConfig }