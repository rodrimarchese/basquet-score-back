import {PrismaClient} from "@prisma/client";
import {app, server} from "../../src/server";
// @ts-ignore
import supertest from "supertest";
import {configureMockPrisma} from "./e2e.config";

const mockplayer1 = {
    name: "name",
    surname: "surname",
    position: "wing",
    shirtNum: 1,
};
//TODO: /:id/game_stats/:game_id
describe("Player Controller", () => {
    let prisma: PrismaClient;

    beforeAll(async () => {
        prisma = configureMockPrisma();
        await prisma.$connect();
        await deleteDatabase(prisma);
    });

    beforeEach(async () => {
        await deleteDatabase(prisma);
    })


    afterAll(async () => {
        await deleteDatabase(prisma);
        await server.close();
        await prisma.$disconnect();
    })

    describe("GET /players", () => {
        it("should return an empty list", async () => {
            const response = await supertest(app).get("/player");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        it("should return a list of teams", async () => {
            await createMockData(prisma)
            const response = await supertest(app).get("/player");

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1)
        });
    });

    describe("POST /players", () => {
        it("should create a player and return the created player with status 201", async () => {
            const response = await supertest(app).post("/player").send({
                name: "name",
                surname: "surname",
                position: "wing",
                shirtNum: 1
            });

            expect(response.status).toBe(201);
            expect(response.body.name).toEqual(mockplayer1.name);
            expect(response.body.id).toBeDefined();
            expect(response.body.createdAt).toBeDefined();
        });

        it("should not create players with no name", async () => {
            await createMockData(prisma);
            const response = await supertest(app).post("/player").send({});

            expect(response.status).toBe(500);
        });
    });

    describe("PUT /players", () => {
        it("should create a player and return the created player with status 201", async () => {
            const player = await returnMockData(prisma)
            const team = await returnTeamMockData(prisma)
            const response = await supertest(app).put("/player/add_team").send({
                playerId: player.id,
                teamId: team.id,
            });

            expect(response.status).toBe(200);
            expect(response.body.name).toEqual(mockplayer1.name);
            expect(response.body.teamId).toEqual(team.id)
            expect(response.body.id).toBeDefined();
            expect(response.body.createdAt).toBeDefined();
        });

        it("should not add team with no team or player", async () => {
            await createMockData(prisma);
            const response = await supertest(app).put("/player/add_team").send({});

            expect(response.status).toBe(500);
        });
    });
});

async function deleteDatabase(database: PrismaClient) {
    // delete all data from the database
    await database.game.deleteMany({});
    await database.team.deleteMany({});
    await database.player.deleteMany({});
}

async function createMockData(database: PrismaClient) {
    await database.player.create({
        data: mockplayer1,
    });
}

async function returnMockData(database: PrismaClient) {
    return await database.player.create({
        data: mockplayer1,
    });
}

const mockTeam1 = {name: "Team Z"};

async function returnTeamMockData(database: PrismaClient) {
    return await database.team.create({
        data: mockTeam1,
    });
}