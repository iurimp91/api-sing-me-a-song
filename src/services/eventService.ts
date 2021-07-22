import * as eventRepository from "../repositories/eventRepository";

async function createRecommendation(body: Object) {
    await eventRepository.insertRecommendation(body);
}

async function vote(id: Number) {
    const score = await eventRepository.getScore(id);
    
    if (score === false) return false;
    
    const newScore = score + 1;
    
    await eventRepository.insertVote(id, newScore);
}

export { createRecommendation, vote };