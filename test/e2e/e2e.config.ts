import {PrismaClient} from "@prisma/client";

export const configureMockPrisma = (): PrismaClient => {
    process.env.DATABASE_URL = require("dotenv").config({
        path: "./.env.test",
    }).parsed.DATABASE_URL;
    return new PrismaClient();
}
