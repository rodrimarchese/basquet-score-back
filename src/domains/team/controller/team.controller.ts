import {Request, Response, Router} from 'express';
import HttpStatus from 'http-status';
import {BodyValidation} from '@utils'
import {CreateTeamDto} from '../dto';
import {ITeamService, TeamService} from '../service';
import "express-async-errors";
import app from "express";
import {getTeams, teamResponse} from "@externalServices/external-api/externalApi";

export const makeTeamRouter = (service: ITeamService): Router => {
    const teamRouter = app.Router()

    teamRouter.get('/', async (req: Request, res: Response) => {
        const {limit, before, after} = req.query as Record<string, string>;

        const teams = await service.getLatestTeam({limit: Number(limit), before, after});

        return res.status(HttpStatus.OK).json(teams);
    });

    teamRouter.post('/', BodyValidation(CreateTeamDto), async (req: Request, res: Response) => {
        const team = await service.create(req.body);

        return res.status(HttpStatus.CREATED).json(team);
    });

    teamRouter.get('/players/:team_id', async (req: Request, res: Response) => {
        const {team_id} = req.params as Record<string, string>
        const players = await service.getPlayers(team_id);
        return res.status(HttpStatus.OK).json(players);
    });

    teamRouter.get('/team_names', async (req: Request, res: Response) => {
        const contains = req.query.contains || "";
        const page = req.query.page || 1;
        const teamResponse : teamResponse = await getTeams(contains.toString(), parseInt(page.toString()))
        return res.status(HttpStatus.OK).json(teamResponse);
    });

    return teamRouter
}
