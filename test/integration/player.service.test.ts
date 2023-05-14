import { PlayerService } from "../../src/domains/player/service";
import { describe, jest } from "@jest/globals";
import {
  IPlayerRepository,
  PlayerRepository,
} from "../../src/domains/player/repository";
import { db } from "../../src/utils";
import { PlayerDto } from "../../src/domains/player/dto";

describe("PlayerService", () => {
  let PlayerRepositoryMock: IPlayerRepository = new PlayerRepository(db);

  const createPlayerDto = {
    name: "name",
    surname: "surname",
    position: "wing",
    shirtNum: 1,
  };

  const player: PlayerDto = {
    id: "1",
    name: "name",
    surname: "surname",
    position: "wing",
    shirtNum: 1,
    createdAt: new Date(),
  };

  const playerService = new PlayerService(PlayerRepositoryMock);

  test("create() should return a TeamDto object", async () => {
    jest
      .spyOn(playerService, "create")
      .mockImplementation(() => Promise.resolve(player));
    const playerDto = await playerService.create(createPlayerDto);

    expect(playerDto.id).toBeDefined();
    expect(playerDto.name).toEqual("name");
    expect(playerDto.createdAt).toBeDefined();
  });
});
