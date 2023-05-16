import { Router } from "express";

import { makeTeamRouter } from "@domains/team/controller";
import { ITeamService, TeamService } from "@domains/team/service";
import { TeamRepository } from "@domains/team/repository";
import { db } from "@utils";
import { makePlayerRouter } from "@domains/player/controller";
import { PlayerRepository } from "@domains/player/repository";
import { IPlayerService, PlayerService } from "@domains/player/service";
import {gameRouter} from "@domains/game/controller";

export const router = Router();

const teamService: ITeamService = new TeamService(new TeamRepository(db));

router.use("/team", makeTeamRouter(teamService));

const playerService: IPlayerService = new PlayerService(
  new PlayerRepository(db)
);

router.use("/player", makePlayerRouter(playerService,teamService));
router.use("/game",gameRouter)
