import {configureMockPrisma} from "./e2e.config";
import {app, server} from "../../src/server";
// @ts-ignore
import supertest from "supertest";
import {PrismaClient} from "@prisma/client";
import {TeamDto} from "../../src/domains/team/dto";
import {isIPv4} from "net";

const mockGame = {
    awayTeamId: "b3131535-2b8e-4f34-9754-b7f4a754d2e3",
    homeTeamId: "7bf4e03a-9b0a-4e3e-b7c9-3041eedaa2da",
    date: new Date(),
}
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

    describe("POST /teams", () => {
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

async function mockTeam1(database: PrismaClient): Promise<TeamDto> {
    return await database.team.create({
        data: {name: "Team 3"},
    });
}

async function mockTeam2(database: PrismaClient): Promise<TeamDto> {
    return await database.team.create({
        data: {name: "Team 4"},
    });
}
