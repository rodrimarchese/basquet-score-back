import {PrismaClient} from "@prisma/client";
import {app} from "../../src/server";
// @ts-ignore
import supertest from "supertest";

const mockplayer1 = {
    name: "name",
    surname: "surname",
    position: "wing",
    shirtNum: 1,
};

describe("Player Controller", () => {
    let prisma: PrismaClient;

    beforeAll(async () => {
        process.env.DATABASE_URL = require("dotenv").config({
            path: "./.env.test",
        }).parsed.DATABASE_URL;

        prisma = new PrismaClient();

        await prisma.$connect();

        await deleteDatabase(prisma);
    });

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
                shirtNum: 1,
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
});

async function deleteDatabase(database: PrismaClient) {
    // delete all data from the database
    await database.player.deleteMany({});
    await database.player.deleteMany({});
    await database.player.deleteMany({});
}

async function createMockData(database: PrismaClient) {
    await database.player.create({
        data: mockplayer1,
    });
}
