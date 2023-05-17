import {describe, jest} from "@jest/globals";
import {IPlayerRepository, PlayerRepository} from "../../src/domains/player/repository";
import {db} from "../../src/utils";
import {PlayerService} from "../../src/domains/player/service";
import {GameRepository, IGameRepository} from "../../src/domains/game/repository";
import {GameService} from "../../src/domains/game/service";

describe("GameService", () => {
    let gameRepositoryMock: IGameRepository = new GameRepository(db);

    const gameService = new GameService(gameRepositoryMock);
    const date = new Date()

    const mockGame = {
            awayTeamId: "1",
            homeTeamId: "2",
            date: date,
    }
    const gameDTO = {
        id: "3",
        awayTeamId: "1",
        homeTeamId: "2",
        date: date,
    }

    const gameDTO1 = {
        id: "4",
        awayTeamId: "1",
        homeTeamId: "2",
        date: date,
    }

    test("create() should return a GameDTO object", async () => {
        jest
            .spyOn(gameService, "create")
            .mockImplementation(() => Promise.resolve(gameDTO));
        const gameDto = await gameService.create(mockGame);

        expect(gameDto.id).toBeDefined();
        expect(gameDto.awayTeamId).toEqual("1");
        expect(gameDto.homeTeamId).toEqual("2");
    });

    test("getLatestGame() should return 1 GameDTO object", async () => {
        jest
            .spyOn(gameService, "getLatestGame")
            .mockImplementation(() => Promise.resolve([gameDTO, gameDTO1]));
        const gameDto = await gameService.getLatestGame({
            limit: Number(1)
        });

        expect(gameDto[0].id).toEqual("3");
    });

    test("getLatestGame() should return 2 GameDTO object", async () => {
        jest
            .spyOn(gameService, "getLatestGame")
            .mockImplementation(() => Promise.resolve([gameDTO, gameDTO1]));
        const gameDto = await gameService.getLatestGame({
            limit: Number(2)
        });

        expect(gameDto[0].id).toEqual("3");
        expect(gameDto[1].id).toEqual("4");

    });

    test("endGame() should return 2 GameDTO object", async () => {
        jest
            .spyOn(gameService, "endGame")
            .mockImplementation(() => Promise.resolve(gameDTO));
        const gameDto = await gameService.endGame(gameDTO.id);

        expect(gameDto.id).toEqual("3");

    });

    test("getGame() should return a GameDTO object", async () => {
        jest
            .spyOn(gameService, "getGame")
            .mockImplementation(() => Promise.resolve(gameDTO));
        const gameDto = await gameService.getGame(gameDTO.id);
        expect(gameDto!!.id).toEqual("3");

    });

    test("getGame() should return a GameDTO object", async () => {
        jest
            .spyOn(gameService, "getGame")
            .mockImplementation(() => Promise.resolve(undefined));
        const gameDto = await gameService.getGame(gameDTO.id);
        expect(gameDto).toEqual(undefined);

    });


});
