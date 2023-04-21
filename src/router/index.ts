import {Router} from 'express';

import {makeTeamRouter} from '@domains/team/controller';
import {ITeamService, TeamService} from "@domains/team/service";
import {TeamRepository} from "@domains/team/repository";
import {db} from "@utils";

export const router = Router();

const teamService: ITeamService = new TeamService(new TeamRepository(db));

router.use('/team', makeTeamRouter(teamService));
