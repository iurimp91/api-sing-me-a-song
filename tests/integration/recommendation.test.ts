import "../../src/setup";

import supertest from "supertest";
import app from "../../src/app";

import { clearDatabase, endConnection, insertRecommendation } from "../utils/database";
import connection from "../../src/database";

let validId:Number;
let invalidId:Number;

beforeEach(async () => {
    await clearDatabase();
    validId = await insertRecommendation("Teste1", "https://www.youtube.com/watch?v=uLv20oZqWUI", 0);
    invalidId = await insertRecommendation("Teste2", "https://www.youtube.com/watch?v=uLv20oZqWUI", -5);
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
        const response = await supertest(app).post(`/recommendations/${validId}/upvote`);

        expect(response.status).toEqual(200);
    });
});

describe("POST /recommendations/:id/downvote", () => {
    it("should answer with status 400 for invalid params", async () => {
        const response = await supertest(app).post("/recommendations/abc/downvote");

        expect(response.status).toEqual(400);
    });

    it("should answer with status 400 for non existing recommendation", async () => {
        const response = await supertest(app).post("/recommendations/1000/downvote");

        expect(response.status).toEqual(400);
    });

    it("should answer with status 200 for valid params and score higher than or equal -5", async () => {
        const response = await supertest(app).post(`/recommendations/${validId}/downvote`);

        expect(response.status).toEqual(200);
    });

    it("should answer with status 200 and delete recommendation for valid params and score less than -5", async () => {
        const voteResponse = await supertest(app).post(`/recommendations/${invalidId}/downvote`);
        // acertar esse teste depois de criar a rota get
        const deleteResponse = await connection.query(`
            SELECT * FROM recommendations
            WHERE id = $1
        `, [invalidId]);

        expect(voteResponse.status).toEqual(200);
        expect(deleteResponse.rows[0]).toEqual(undefined);
    });
});
