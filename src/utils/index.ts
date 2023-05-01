import {app} from "@server";

export * from './database';
export * from './logger';
export * from './constants';
export * from './errors';
export * from './validation';
import cors from 'cors';


app.use(cors({ origin: true }))