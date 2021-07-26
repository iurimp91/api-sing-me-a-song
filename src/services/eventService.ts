import * as eventRepository from "../repositories/eventRepository";

import { Body } from "../interfaces/interfaces"

async function createRecommendation(body: Body) {
    await eventRepository.insertRecommendation(body);
}

async function upVote(id: number) {
    const score = await eventRepository.getScore(id);
    
    if (score === false) return false;
    
    await eventRepository.insertVote(id, 1);
    return true;
}

async function downVote(id: number) {
    const score = await eventRepository.getScore(id);
    
    if (score === false) {
        return false;
    } else if (score === -5)  {
        await eventRepository.deleteRecommendation(id);
        return;
    }
    
    await eventRepository.insertVote(id, -1);
    return true;
}

async function getRandomRecommendation() {
    const random = Math.random();

    const response = await eventRepository.selectRandomRecommendation(random);

    return response;
}

async function getTopRecommendation(amount: number) {
    const response = await eventRepository.selectTopRecommendation(amount);

    return response;
}

export {
    createRecommendation,
    upVote,
    downVote,
    getRandomRecommendation,
    getTopRecommendation
};