import { response } from "express";
import { QueryResult } from "pg";
import connection from "../database";

async function insertRecommendation(body: Object) {
    const { name, youtubeLink } = Object(body);
    
    await connection.query(`
        INSERT INTO recommendations
        (name, "youtubeLink")
        VALUES ($1, $2)
    `,[name, youtubeLink]);
}

async function getScore(id: Number) {
    const result = await connection.query(`
        SELECT score FROM recommendations
        WHERE id = $1 
    `, [id]);

    const score = result.rows[0]?.score;

    return score === undefined ? false : score;
}

async function insertVote(id: Number, score: Number) {
    await connection.query(`
        UPDATE recommendations
        SET score = $1
        WHERE id = $2
    `,[score, id]);
}

async function deleteRecommendation(id: Number) {
    await connection.query(`
        DELETE FROM recommendations
        WHERE id = $1
    `, [id]);
}

async function selectRandomRecommendation(random: Number): Promise<Object> {
    let result: QueryResult<Object>;
    
    if (random > 0.3) {
        result = await connection.query(`
            SELECT * FROM recommendations
            WHERE score > 10000
            ORDER BY RANDOM()
            LIMIT 1
        `);    
    } else {
        result = await connection.query(`
            SELECT * FROM recommendations
            WHERE score <= 10
            ORDER BY RANDOM()
            LIMIT 1
        `); 
    }

    if (result.rows[0] === undefined) {
        result = await connection.query(`
            SELECT * FROM recommendations
            ORDER BY RANDOM()
            LIMIT 1
        `);
    }
    
    return result.rows[0] === undefined ? 404 : result.rows[0];
}

export {
    insertRecommendation,
    getScore,
    insertVote,
    deleteRecommendation,
    selectRandomRecommendation
};