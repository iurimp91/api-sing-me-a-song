import connection from "../../src/database";

export async function insertRecommendation(name: string, link: string, score: number) {
    const result = await connection.query(`
        INSERT INTO recommendations (name, "youtubeLink", score)
        VALUES ($1, $2, $3)
        RETURNING id
    `, [name, link, score]);
    return result.rows[0].id;
}