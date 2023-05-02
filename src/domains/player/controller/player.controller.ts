import { Request, Response, Router } from "express";
import HttpStatus from "http-status";
import "express-async-errors";
import { BodyValidation } from "@utils";
import { CreatePlayerDto } from "../dto";
import { IPlayerService } from "../service";
import app from "express";

export const makePlayerRouter = (service: IPlayerService): Router => {
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
  return playerRouter;
};
