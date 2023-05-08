import express from "express";
import { router } from './router';
import {Constants, Logger} from '@utils';
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();
app.set("trust proxy", true);

// Set up request parsers
app.use(express.json()); // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()) // Parse cookies

// Set up CORS
app.use(
    cors({
        origin: Constants.CORS_WHITELIST,
    })
)


app.listen(Constants.PORT, () => {
    Logger.info(`Server listening on port ${Constants.PORT}`);
});


app.use('/', router);

export { app };
