import express from "express";
import { json } from "body-parser";
import { router } from '@router';
import {Constants, Logger} from '@utils';

const app = express();
app.set("trust proxy", true);

// Set up request parsers
app.use(express.json()); // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded request bodies

app.listen(Constants.PORT, () => {
    Logger.info(`Server listening on port ${Constants.PORT}`);
});


app.use('/api', router);

export { app };
