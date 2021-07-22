import "../../src/setup";

import supertest from "supertest";
import app from "../../src/app";

import { clearDatabase, endConnection } from "../utils/database";

beforeEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await endConnection();
});

describe("POST /recommendations", () => {
    function createBody(name: String, youtubeLink: String) {
        return {
            name,
            youtubeLink
        };
    }

    it("should answer with status 400 for invalid body", async () => {
        const body = createBody("", "https://www.youtube.com");

        const response = await supertest(app).post("/recommendations").send(body);

        expect(response.status).toEqual(400);
    });

    it("should answer with status 400 for invalid youtbeLink", async () => {
        const body = createBody("Teste", "noLink");

        const response = await supertest(app).post("/recommendations").send(body);

        expect(response.status).toEqual(400);
    });

    it("should answer with status 200 for valid body", async () => {
        const body = createBody("Teste", "https://www.youtube.com");

        const response = await supertest(app).post("/recommendations").send(body);

        expect(response.status).toEqual(200);
    });
});
