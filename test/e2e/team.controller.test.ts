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

    afterEach(async () => {
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
