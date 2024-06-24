import express, { Application } from 'express';
import { router } from "./routes/";
import { initPassportAndSessions } from './passport/passport.sessions.config'
// const log = config.log();

const App = () => {
    let app: Application = express();
    app = initPassportAndSessions(app)

    app.use("/api", router);
    app.listen(3000, function () {
        // log.info('listening on port 3000.');
    });
    return app;
};


export default App;