import connection from "../../src/database";

export async function clearDatabase() {
    await connection.query(`TRUNCATE recommendations RESTART IDENTITY`);
}

export async function endConnection() {
    await clearDatabase();
    await connection.end();
}