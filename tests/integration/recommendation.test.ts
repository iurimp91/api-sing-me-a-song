import "../../src/setup";

import supertest from "supertest";
import app from "../../src/app";

import { clearDatabase, endConnection, insertRecommendation } from "../utils/database";

let id:Number;

beforeEach(async () => {
    await clearDatabase();
    id = await insertRecommendation();
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
        const body = createBody("", "https://www.youtube.com/watch?v=uLv20oZqWUI");

        const response = await supertest(app).post("/recommendations").send(body);

        expect(response.status).toEqual(400);
    });

    it("should answer with status 400 for invalid youtbeLink", async () => {
        const body = createBody("Teste", "https://www.globo.com");

        const response = await supertest(app).post("/recommendations").send(body);

        expect(response.status).toEqual(400);
    });

    it("should answer with status 200 for valid body", async () => {
        const body = createBody("Teste", "https://www.youtube.com/watch?v=uLv20oZqWUI");

        const response = await supertest(app).post("/recommendations").send(body);

        expect(response.status).toEqual(200);
    });
});

describe("POST /recommendations/:id/upvote", () => {
    it("should answer with status 400 for invalid params", async () => {
        const response = await supertest(app).post("/recommendations/abc/upvote");

        expect(response.status).toEqual(400);
    });

    it("should answer with status 400 for non existing recommendation", async () => {
        const response = await supertest(app).post("/recommendations/1000/upvote");

        expect(response.status).toEqual(400);
    });

    it("should answer with status 200 for valid params", async () => {
        const response = await supertest(app).post(`/recommendations/${id}/upvote`);

        expect(response.status).toEqual(200);
    });
});
