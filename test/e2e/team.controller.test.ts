import {PrismaClient} from "@prisma/client";
import {app, server} from "../../src/server";
// @ts-ignore
import supertest from "supertest";
import {configureMockPrisma} from "./e2e.config";
import {afterEach} from "@jest/globals";

const mockTeam1 = {name: "Team A"};

describe("Team Controller", () => {
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


    describe("GET /teams", () => {
        it("should return an empty list", async () => {
            const response = await supertest(app).get("/team");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        it("should return a list of teams", async () => {
            await createMockData(prisma)
            const response = await supertest(app).get("/team");

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
        });
    });

    describe("POST /teams", () => {
        it("should create a team and return the created team with status 201", async () => {
            const response = await supertest(app).post("/team").send({
                name: "Team A",
            });

            expect(response.status).toBe(201);
            expect(response.body.name).toEqual(mockTeam1.name);
            expect(response.body.id).toBeDefined();
            expect(response.body.createdAt).toBeDefined();
        });
        it("should not create repeated teams", async () => {
            await supertest(app).post("/team").send({
                name: mockTeam1.name,
            });
            const response = await supertest(app).post("/team").send({
                name: mockTeam1.name,
            });

            expect(response.status).toBe(500);
        });
        it("should not create teams with no name", async () => {
            const response = await supertest(app).post("/team").send({});

            expect(response.status).toBe(500);
        });
    });

    describe("GET /team/players/:team_id", () => {
        it("should create a team and return the created team with status 201", async () => {
            const team = await returnMockData(prisma)
            const player = await returnPlayerMockData(prisma)
            const response1 = await supertest(app).put("/player/add_team").send({
                playerId: player.id,
                teamId: team.id,
            });
            const response = await supertest(app).get("/team/players/" + team.id).send();
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined()
        });
    });
});

async function deleteDatabase(database: PrismaClient) {
    // delete all data from the database
    await database.team.deleteMany({});
}

async function createMockData(database: PrismaClient) {
    await database.team.create({
        data: mockTeam1,
    });
}

async function returnMockData(database: PrismaClient) {
   return  await database.team.create({
        data: mockTeam1,
    });
}

const mockplayer1 = {
    name: "name",
    surname: "surname",
    position: "wing",
    shirtNum: 1,
};

async function returnPlayerMockData(database: PrismaClient) {
    return await database.player.create({
        data: mockplayer1,
    });
}
