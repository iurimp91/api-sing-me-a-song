import connection from "../../src/database";

export async function clearDatabase() {
    await connection.query(`TRUNCATE recommendations RESTART IDENTITY`);
}

export async function insertRecommendation(name: String, link: String, score: Number) {
    const result = await connection.query(`
        INSERT INTO recommendations (name, "youtubeLink", score)
        VALUES ($1, $2, $3)
        RETURNING id
    `, [name, link, score]);
    return result.rows[0].id;
}

export async function endConnection() {
    await clearDatabase();
    await connection.end();
}