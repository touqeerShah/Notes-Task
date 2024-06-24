import passport from 'passport';
import express from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import User from "../models/user/userModel";
import compression from 'compression';
import * as bodyParser from 'body-parser';
import { appConfig } from '../config/appConfig';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import path from 'path'; // To work with file extensions
import cors from 'cors';

const log = appConfig.log();



export function initPassportAndSessions(app: express.Application) {

    app.use(helmet());
    app.use(compression());

    app.locals.title = appConfig.siteName;
    app.use(bodyParser.urlencoded({
        extended: true, limit: '35mb',
        parameterLimit: 50000,
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors());

    console.log("path.join(__dirname, 'profile-avatar')", path.join(process.cwd(), "src", 'profile-avatar'))
    app.use('/profile-avatar', express.static(path.join(process.cwd(), "src", 'profile-avatar')));


    const env = app.get('env');
    console.log("env", env);
    var oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (env === 'production') {
        app.set('trust proxy', 'loopback');
        app.use(
            session({
                secret: appConfig.secret ? appConfig.secret : "",
                name: appConfig.name,
                proxy: true,
                cookie: {
                    secure: true,
                    maxAge: toMilliseconds(7, 0, 0),
                    expires: new Date(Date.now() + 60 * 60 * 2 * 1000 + toMilliseconds(1, 0, 0))// UTC time
                },
                resave: false,
                saveUninitialized: false,
                store: MongoStore.create({ mongoUrl: appConfig.mongoDB.dsn }),
            })
        );

    } else {
        // console.log("toMilliseconds = ", toMilliseconds(1, 0, 0))
        app.use(
            session({
                secret: appConfig.secret ? appConfig.secret : "",
                resave: false,
                cookie: {
                    secure: true,
                    maxAge: toMilliseconds(7, 0, 0),
                    expires: new Date(Date.now() + 60 * 60 * 2 * 1000 + toMilliseconds(7, 0, 0))// UTC time
                },
                name: appConfig.name,
                saveUninitialized: false,
                store: MongoStore.create({ mongoUrl: "appConfig.mongoDB.dsn" }), // need tp add proper url access
            })
        );
        // console.log("new Date(Date.now() + 60 * 60 * 2 * 1000 + toMilliseconds(1, 0, 0))", new Date(Date.now() + 60 * 60 * 2 * 1000 + toMilliseconds(1, 0, 0)));


    }

    app.use(flash());
    app.use(passport.session());
    app.use(passport.initialize());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser(User.deserializeUser());

    log.info("passport and sessions loaded")

    return app;
}


export const toMilliseconds = (hrs: number, min: number, sec: number) => (hrs * 60 * 60 + min * 60 + sec) * 1000;
