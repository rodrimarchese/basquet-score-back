import {Request, Response, Router} from 'express';
import HttpStatus from 'http-status';
import {db} from '@utils'
import {TeamDto, CreateTeamDto} from '../dto';
import {TeamRepository} from '../repository'
import {ITeamService, TeamService} from '../service';
import "express-async-errors";
import {BodyValidation} from "@utils/validation";

export const teamRouter = Router();
const service: ITeamService = new TeamService(new TeamRepository(db));

teamRouter.get('/', async (req: Request, res: Response) => {
    const {limit, before, after} = req.query as Record<string, string>;

    const teams = await service.getLatestTeam({limit: Number(limit), before, after});

    return res.status(HttpStatus.OK).json(teams);
});

teamRouter.post('/', BodyValidation(CreateTeamDto), async (req: Request, res: Response) => {
    const team = await service.create(req.body);

    return res.status(HttpStatus.CREATED).json(team);
});