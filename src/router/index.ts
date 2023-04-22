import {Router} from 'express';

import {makeTeamRouter} from '@domains/team/controller';
import {ITeamService, TeamService} from "@domains/team/service";
import {TeamRepository} from "@domains/team/repository";
import {db} from "@utils";
import {makePlayerRouter} from "@domains/Player/controller";
import {PlayerRepository} from "@domains/Player/repository";
import {IPlayerService, PlayerService} from "@domains/Player/service";

export const router = Router();

const teamService: ITeamService = new TeamService(new TeamRepository(db));

router.use('/team', makeTeamRouter(teamService));

const playerService: IPlayerService = new PlayerService(new PlayerRepository(db));

router.use('/player', makePlayerRouter(playerService));
