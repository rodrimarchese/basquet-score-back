import {configureMockPrisma} from "./e2e.config";
import {app, server} from "../../src/server";
// @ts-ignore
import supertest from "supertest";
import {PrismaClient} from "@prisma/client";
import {TeamDto} from "../../src/domains/team/dto";
import {afterEach} from "@jest/globals";

describe("Game Controller", () => {
    const prisma = configureMockPrisma();

    beforeAll(async () => {
        await prisma.$connect();
    });

    beforeEach(async () => {
        await deleteDatabase(prisma);
    })


    afterAll(async () => {
        await deleteDatabase(prisma);
        await server.close();
        await prisma.$disconnect();
    })


    describe("GET /game", () => {
        it("should return an empty list", async () => {
            const response = await supertest(app).get("/game");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        it("should return a list of teams", async () => {
            await createMockData(prisma)
            const response = await supertest(app).get("/game");

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
        });
    });

    describe("POST /game", () => {
        it("should create a game and return the created team with status 201", async () => {
            const team1 = await mockTeam1(prisma)
            const team2 =await mockTeam2(prisma)

            const response = await supertest(app).post("/game").send({
                awayTeamId: team1.id,
                homeTeamId: team2.id,
                date: new Date(),
            });

            expect(response.status).toBe(201);
            expect(response.body.homeTeamId).toEqual(team2.id);
            expect(response.body.id).toBeDefined();
            expect(response.body.date).toBeDefined();
            expect(response.body.awayTeamId).toEqual(team1.id);
        });

        it("should not create game with no fields", async () => {
            const response = await supertest(app).post("/game").send({});
            expect(response.status).toBe(500);
        });
    });

    describe("POST /end_game/gameId", () => {
        it("should stop a game and return the  game with status 201", async () => {
            const team1 = await mockTeam1(prisma)
            const team2 =await mockTeam2(prisma)

            const game = await supertest(app).post("/game").send({
                awayTeamId: team1.id,
                homeTeamId: team2.id,
                date: new Date(),
            });

            const gameId = game.body.id

            const response = await supertest(app).post("/game/end_game/" + gameId).send();

            expect(response.status).toBe(200);
            expect(response.body.homeTeamId).toEqual(team2.id);
            expect(response.body.id).toBeDefined();
            expect(response.body.date).toBeDefined();
            expect(response.body.awayTeamId).toEqual(team1.id);
        });

    });

    describe("POST /player_score", () => {
        it("should stop a game and return the  game with status 201", async () => {
            const game = await returnMockData(prisma)
            const player = await mockPlayer(prisma, game.homeTeamId)
            const response = await supertest(app).post("/game/player_score").send({
                game_id: game.id,
                player_id: player.id,
                score: "2",
            });
            expect(response.status).toBe(200);
        });
    });

    describe("POST /player_foul", () => {
        it("should stop a game and return the  game with status 201", async () => {
            const game = await returnMockData(prisma)
            const player = await mockPlayer(prisma, game.homeTeamId)
            const response = await supertest(app).post("/game/player_foul").send({
                game_id: game.id,
                player_id: player.id,
                foul: "2",
            });
            expect(response.status).toBe(200);
        });

    });

});

async function deleteDatabase(database: PrismaClient) {
    await database.game.deleteMany({});
}

async function createMockData(database: PrismaClient) {
    const team1 =await database.team.create({
        data: {name: "Team 1"},
    });
    const team2 =await database.team.create({
        data: {name: "Team 2"},
    });
    await database.game.create({
        data: {
            awayTeamId: team1.id,
            homeTeamId: team2.id,
            date: new Date(),
        },
    });
}

async function returnMockData(database: PrismaClient) {
    const team1 =await database.team.create({
        data: {name: "Team 1"},
    });
    const team2 =await database.team.create({
        data: {name: "Team 2"},
    });

    return await database.game.create({
        data: {
            awayTeamId: team1.id,
            homeTeamId: team2.id,
            date: new Date(),
        },
    });
}


async function mockTeam1(database: PrismaClient): Promise<TeamDto> {
    return await database.team.create({
        data: {name: "Team 3"},
    });
}


async function mockPlayer(database: PrismaClient, teamId: string): Promise<TeamDto> {
    return await database.player.create({
        data: {
            name: "name",
            surname: "surname",
            position: "wing",
            shirtNum: 1,
            teamId: teamId,
        },
    });
}


async function mockTeam2(database: PrismaClient): Promise<TeamDto> {
    return await database.team.create({
        data: {name: "Team 4"},
    });
}
