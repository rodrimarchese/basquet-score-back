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

  const playerWithTeam: PlayerDto = {
    id: "1",
    name: "name",
    surname: "surname",
    position: "wing",
    shirtNum: 1,
    team: {
      id: "2",
      name: "Team A",
      createdAt: new Date()
    },
    createdAt: new Date(),
  };

  const player2: PlayerDto = {
    id: "2",
    name: "name2",
    surname: "surname2",
    position: "wing",
    shirtNum: 2,
    createdAt: new Date(),
  };

  //TODO: getPlayerGameStats
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

  test("getLatestPlayer() should return two objects", async () => {
    jest
        .spyOn(playerService, "getLatestPlayer")
        .mockImplementation(() => Promise.resolve([player, player2]));
    const playerDto = await playerService.getLatestPlayer({
      limit: Number(2)
    });
    expect(playerDto[0].id).toBeDefined();
    expect(playerDto[0].name).toEqual("name");
    expect(playerDto[0].createdAt).toBeDefined();

    expect(playerDto[1].id).toBeDefined();
    expect(playerDto[1].name).toEqual("name2");
    expect(playerDto[1].createdAt).toBeDefined();
  });

  test("getLatestPlayer() should return one object", async () => {
    jest
        .spyOn(playerService, "getLatestPlayer")
        .mockImplementation(() => Promise.resolve([player, player2]));
    const playerDto = await playerService.getLatestPlayer({
      limit: Number(1)
    });
    expect(playerDto[0].id).toBeDefined();
    expect(playerDto[0].name).toEqual("name");
    expect(playerDto[0].createdAt).toBeDefined();
  });

  test("defineTeam() should return one object", async () => {
    jest
        .spyOn(playerService, "defineTeam")
        .mockImplementation(() => Promise.resolve(playerWithTeam));
    const playerDto = await playerService.defineTeam("1", "2")
    expect(playerDto.id).toBeDefined();
    expect(playerDto.name).toEqual("name");
    expect(playerDto.team!!.id).toEqual("2");
    expect(playerDto.createdAt).toBeDefined();

  });

});
