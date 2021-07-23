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

export { insertRecommendation, getScore, insertVote, deleteRecommendation };