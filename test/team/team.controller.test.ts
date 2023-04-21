// @ts-ignore
import request from 'supertest';
import {Router} from 'express';
import {TeamService} from "../../src/domains/team/service";
import {router} from "../../src/router";
import {PrismaClient} from "@prisma/client";
import {execSync} from "child_process";
import {app} from '../../src/server';
// @ts-ignore
import supertest from "supertest";
import {CreateTeamDto, TeamDto} from "../../src/domains/team/dto";
import {createMockContext} from "../../src/context";

const mockTeam1 = {id: 1, name: 'Team A'};
const mockTeam2 = {id: 2, name: 'Team B'};


describe('Team Controller', () => {

    process.env.DATABASE_URL = require("dotenv").config({path: "./.env.test"}).parsed.DATABASE_URL
    const prisma = new PrismaClient();

    beforeAll(async () => {
        process.env.DATABASE_URL = require("dotenv").config({path: "./.env.test"}).parsed.DATABASE_URL


        await prisma.$connect();

        await deleteDatabase(prisma);

    });

    describe('GET /teams', () => {
        it('should return an empty list', async () => {

            const response = await supertest(app).get("/team")

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);

        });
        it('should return a list of teams', async () => {
            await createMockData(prisma);
            const response = await supertest(app).get("/team")

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);

        });
    });

    describe('POST /teams', () => {
        it('should create a team and return the created team with status 201', async () => {
            const response = await supertest(app).post("/team")
                .send({
                    name: "Team A"
                })

            expect(response.status).toBe(201);
            expect(response.body.name).toEqual(mockTeam1.name);
            expect(response.body.id).toBeDefined()
            expect(response.body.createdAt).toBeDefined()
        });
        it('should not create repeated teams', async () => {
            await supertest(app).post("/team")
                .send({
                    name: mockTeam1.name
                })
            const response = await supertest(app).post("/team")
                .send({
                    name: mockTeam1.name
                })

            expect(response.status).toBe(500);
        });
        it('should not create teams with no name', async () => {
            await createMockData(prisma);
            const response = await supertest(app).post("/team")
                .send({
                })

            expect(response.status).toBe(500);
        });
    });
});

async function deleteDatabase(database: PrismaClient) {
    // delete all data from the database
    await database.team.deleteMany({});
    await database.team.deleteMany({});
    await database.team.deleteMany({});
}

async function createMockData(database: PrismaClient) {
    const mockedCreateTeam1 = async () => {
        await database.team.create({
            data: {
                name: mockTeam1.name
            }
        })
    }

}
