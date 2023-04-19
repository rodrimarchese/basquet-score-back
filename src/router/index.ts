import {Router} from 'express';

import { teamRouter } from '@domains/team/controller';

export const router = Router();

router.use('/team', teamRouter);
