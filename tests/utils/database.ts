import connection from "../../src/database";

export async function clearDatabase() {
    await connection.query(`TRUNCATE recommendations RESTART IDENTITY`);
}

export async function insertRecommendation() {
    const result = await connection.query(`
        INSERT INTO recommendations (name, "youtubeLink")
        VALUES ('Teste', 'https://www.youtube.com/watch?v=uLv20oZqWUI')
        RETURNING id
    `);
    return result.rows[0].id;
}

export async function endConnection() {
    await clearDatabase();
    await connection.end();
}