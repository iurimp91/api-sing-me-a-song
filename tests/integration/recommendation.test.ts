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
    await insertRecommendation("Teste3", "https://www.youtube.com/watch?v=uLv20oZqWUI", 30);
});

afterAll(async () => {
    await endConnection();
});

describe("POST /recommendations", () => {
    function createBody(name: String, youtubeLink: String) {
        return { name, youtubeLink };
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

    it("should answer with status 200 for valid params and score higher than -5", async () => {
        const response = await supertest(app).post(`/recommendations/${validId}/downvote`);

        expect(response.status).toEqual(200);
    });

    it("should answer with status 200 and delete recommendation for valid params and score equal to -5", async () => {
        const voteResponse = await supertest(app).post(`/recommendations/${invalidId}/downvote`);
        
        const deleteResponse = await connection.query(`
            SELECT * FROM recommendations
            WHERE id = $1
        `, [invalidId]);

        expect(voteResponse.status).toEqual(200);
        expect(deleteResponse.rows[0]).toEqual(undefined);
    });
});

describe("GET /recommendations/random", () => {
    it("should answer with status 404 if there are no recommendations", async () => {
        await connection.query(`DELETE FROM recommendations`);

        const response = await supertest(app).get("/recommendations/random");

        expect(response.status).toEqual(404);
    });

    it("should answer with an object if there are recommendations", async () => {
        const response = await supertest(app).get("/recommendations/random");

        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                youtubeLink: expect.any(String),
                score: expect.any(Number)
            })
        );
    });
});

describe("GET /recommendations/top/:amount", () => {
    it("should answer with status 404 if there are no recommendations", async () => {
        await connection.query(`DELETE FROM recommendations`);

        const response = await supertest(app).get("/recommendations/top/2");

        expect(response.status).toEqual(404);
    });

    it("should answer with an sorted (desc) array of objects if there are recommendations", async () => {
        const response = await supertest(app).get("/recommendations/top/2");
        
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    youtubeLink: expect.any(String),
                    score: expect.any(Number)
                })
            ])
        );

        expect(response.body[0].score > response.body[1].score).toEqual(true);
    });
});