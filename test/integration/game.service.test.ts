import {describe, jest} from "@jest/globals";
import {db} from "../../src/utils";
import {GameRepository, IGameRepository} from "../../src/domains/game/repository";
import {GameService} from "../../src/domains/game/service";
import {PlayerDto} from "../../src/domains/player/dto";

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

    const player1: PlayerDto = {
        id: "1",
        name: "name",
        surname: "surname",
        position: "wing",
        shirtNum: 1,
        createdAt: new Date(),
    };
    const player2: PlayerDto = {
        id: "3",
        name: "name1",
        surname: "surname1",
        position: "wing",
        shirtNum: 4,
        createdAt: new Date(),
    };

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

    test("addPlayerScore() should return void", async () => {
        jest
            .spyOn(gameService, "addPlayerScore")
            .mockImplementation(() => Promise.resolve());

        const response = await gameService.addPlayerScore(gameDTO.id, "6", "3");
        expect(response).not.toEqual(null)

    });

    test("addPlayerFoul() should return void", async () => {
        jest
            .spyOn(gameService, "addPlayerFoul")
            .mockImplementation(() => Promise.resolve());

        const response = await gameService.addPlayerFoul(gameDTO.id, "6", "3");
        expect(response).not.toEqual(null)

    });

    test("addPlayerChange() should return void", async () => {
        jest
            .spyOn(gameService, "addPlayerChange")
            .mockImplementation(() => Promise.resolve());

        const response = await gameService.addPlayerChange(gameDTO.id, "6", "7");
        expect(response).not.toEqual(null)

    });

    test("getGameLineup() should return empty", async () => {
        jest
            .spyOn(gameService, "getGameLineup")
            .mockImplementation(() => Promise.resolve([]));

        const response = await gameService.getGameLineup(gameDTO.id, "6");
        expect(response).toEqual([])

    });

    test("getGameLineup() should return array", async () => {
        jest
            .spyOn(gameService, "getGameLineup")
            .mockImplementation(() => Promise.resolve([player1, player2]));

        const response = await gameService.getGameLineup(gameDTO.id, "6");
        expect(response).toEqual([player1, player2])

    });


});
