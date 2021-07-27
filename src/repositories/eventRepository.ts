import { QueryResult } from "pg";
import connection from "../database";

import { Body, RecommendationBody } from "../interfaces/interfaces"

async function insertRecommendation(body: Body) {
    const { name, youtubeLink } = body;
    
    await connection.query(`
        INSERT INTO recommendations
        (name, "youtubeLink")
        VALUES ($1, $2)
    `,[name, youtubeLink]);
}

async function getScore(id: number) {
    const result = await connection.query(`
        SELECT score FROM recommendations
        WHERE id = $1 
    `, [id]);

    const score: number = result.rows[0]?.score;

    return score === undefined ? false : score;
}

async function insertVote(id: number, score: number) {
    await connection.query(`
        UPDATE recommendations
        SET score = score + $1
        WHERE id = $2
    `,[score, id]);
}

async function deleteRecommendation(id: number) {
    await connection.query(`
        DELETE FROM recommendations
        WHERE id = $1
    `, [id]);
}

async function selectRandomRecommendation(random: number) {
    let result: QueryResult<RecommendationBody>;
    let whereCondition: string;

    if (random > 0.3) {
        whereCondition = "WHERE score > 10"
    } else {
        whereCondition = "WHERE score <= 10"
    }

    let query = `
        SELECT * FROM recommendations
        ${whereCondition}
        ORDER BY RANDOM()
        LIMIT 1
    `;

    result = await connection.query(query);

    if (result.rows[0] === undefined) {
        whereCondition = "";
        result = await connection.query(query);
    }
    
    return result.rows[0] === undefined ? 404 : result.rows[0];
}

async function selectTopRecommendation(amount: number) {
    const result: QueryResult<RecommendationBody> = await connection.query(`
        SELECT * FROM recommendations
        ORDER BY score DESC
        LIMIT $1    
    `, [amount]);

    return result.rows[0] === undefined ? 404 : result.rows;
}

export {
    insertRecommendation,
    getScore,
    insertVote,
    deleteRecommendation,
    selectRandomRecommendation,
    selectTopRecommendation
};