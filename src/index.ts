#!/usr/bin/env node

/**
 * Module dependencies.
 */

import cluster from 'cluster'
import { cpus } from 'os'
import { appConfig } from './config/appConfig';
import App from './app';
import { connectMongoDB } from './services/db.service';

const log = appConfig.log();
const numCPUs = cpus().length;


// // Helper functions

// /**
//  * Normalize a port into a number, string, or false.
//  * /
function normalizePort(val: string) {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}



if (cluster.isPrimary) {
    log.info(`Master ${process.pid} is running`);
    // log.info("numCPUs", numCPUs)

    for (let i = 0; i < numCPUs; i += 1) {
        cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
        log.fatal(`Worker ${worker.process.pid} just died`);
        cluster.fork();
    });

} else {
    const app = App()
    /**
     * Get port from environment and store in Express.
     */
    const port = normalizePort(process.env.PORT || '3000');
    app?.set('port', port);
    if ("config.mongoDB.dsn") // make connection enabel
        connectMongoDB()
            .then(() => {

                log.info('Connected to MongoDB');
            })
            .catch((err: any) => {
                log.fatal(err);
            });
    // console.log("config.mongoDB.dsn",config.mongoDB.dsn)

    // the server object listens on port 8080
    app?.on('listening', () => {
        const addr = "localhost";
        const bind = `${addr}:${3000}`;
        log.info(`Listening on ${bind}`);
    });

    // Handle server errors
    app?.on('error', (error: any) => {
        if (error?.syscall !== 'listen') {
            throw error;
        }
        const addr = "localhost";


        const bind = `${addr}:${port}`;

        // handle specific listen errors with friendly messages
        switch (error?.code) {
            case 'EACCES':
                log.fatal(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.log("error", error)
                log.fatal(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                log.info(error);
            // throw error;
        }
    });
}



