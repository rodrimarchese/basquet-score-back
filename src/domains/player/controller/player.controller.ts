import { Request, Response, Router } from "express";
import HttpStatus from "http-status";
import "express-async-errors";
import { BodyValidation } from "@utils";
import { CreatePlayerDto } from "../dto";
import { IPlayerService } from "../service";
import app from "express";
import {getPlayers, playerResponse} from "@externalServices/external-api/externalApi";
import {ITeamService} from "@domains/team/service";
import {PatchPlayerDto} from "@domains/player/dto/path-player.dto";

export const makePlayerRouter = (service: IPlayerService, teamService: ITeamService): Router => {
  const playerRouter = app.Router();

  playerRouter.get("/", async (req: Request, res: Response) => {
    const { limit, before, after } = req.query as Record<string, string>;

    const players = await service.getLatestPlayer({
      limit: Number(limit),
      before,
      after,
    });

    return res.status(HttpStatus.OK).json(players);
  });

  playerRouter.post(
    "/",
    BodyValidation(CreatePlayerDto),
    async (req: Request, res: Response) => {
      const player = await service.create(req.body);

      return res.status(HttpStatus.CREATED).json(player);
    }
  );


    playerRouter.post(
        "/create_many",
        async (req: Request, res: Response) => {
            const players: CreatePlayerDto[] = req.body;
            const player = await players.forEach(async (player) => {
                await service.create(player);
            })
            return res.status(HttpStatus.CREATED).json(player);

        }
    );

  playerRouter.get("/:id/game_stats/:game_id", async (req: Request, res: Response) => {
    const { id, game_id } = req.params;
    const player = await service.getPlayerGameStats(id, game_id);

    return res.status(HttpStatus.OK).json(player);
  })

  playerRouter.get("/player_names", async (req: Request, res: Response) => {
    const contains = req.query.contains || "";
    const page = req.query.page || 1;
    const playerResponse : playerResponse = await getPlayers(contains.toString(), parseInt(page.toString()))
    return res.status(HttpStatus.OK).json(playerResponse);
  })

  playerRouter.put( "/add_team",
      BodyValidation(PatchPlayerDto), async (req: Request, res: Response) => {
    const { playerId, teamId } = req.body;
    const correctTeam= await teamService.isValidTeam(teamId)
    if(correctTeam){
      const player = await service.defineTeam(playerId, teamId)
      return res.status(HttpStatus.OK).json(player);
    }else{
      return res.status(HttpStatus.BAD_REQUEST).json(" No team whit that id ");
    }
  })



  return playerRouter;
};
