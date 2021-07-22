import connection from "../database";

async function insertRecommendation(body: Object) {
    const { name, youtubeLink } = Object(body);
    
    await connection.query(`
        INSERT INTO recommendations
        (name, "youtubeLink")
        VALUES ($1, $2)
    `,[name, youtubeLink]);
}

export { insertRecommendation };