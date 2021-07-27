import "../../src/setup";

import supertest from "supertest";
import app from "../../src/app";

import { clearDatabase, endConnection } from "../utils/database";
import { insertRecommendation } from "../factories/recommendationFactory";

import connection from "../../src/database";
import { valid } from "joi";

let validId:number;
let invalidId:number;

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
    function createBody(name: string, youtubeLink: string) {
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

    it("should answer with status 200 for valid body ans save recommendation", async () => {
        const body = createBody("Teste", "https://www.youtube.com/watch?v=uLv20oZqWUI");

        const beforeInsert = await connection.query(`SELECT * FROM recommendations`);

        const response = await supertest(app).post("/recommendations").send(body);

        const afterInsert = await connection.query(`SELECT * FROM recommendations`);

        expect(response.status).toEqual(200);
        expect(beforeInsert.rows.length).toBe(3);
        expect(afterInsert.rows.length).toBe(4);
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

    it("should answer with status 200 for valid params and increase score by 1", async () => {
        const beforeVote = await connection.query(`
            SELECT score FROM recommendations
            WHERE id = $1
        `, [validId]);
        
        const response = await supertest(app).post(`/recommendations/${validId}/upvote`);

        const afterVote = await connection.query(`
            SELECT score FROM recommendations
            WHERE id = $1
        `, [validId]);

        expect(response.status).toEqual(200);
        expect(afterVote.rows[0].score - beforeVote.rows[0].score).toBe(1);
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

    it("should answer with status 200 for valid params and score higher than -5 and decrease score by 1", async () => {
        const beforeVote = await connection.query(`
            SELECT score FROM recommendations
            WHERE id = $1
        `, [validId]);

        console.log(beforeVote.rows)
        
        const response = await supertest(app).post(`/recommendations/${validId}/downvote`);

        const afterVote = await connection.query(`
            SELECT score FROM recommendations
            WHERE id = $1
        `, [validId]);

        expect(response.status).toEqual(200);
        expect(beforeVote.rows[0].score - afterVote.rows[0].score).toBe(1);
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