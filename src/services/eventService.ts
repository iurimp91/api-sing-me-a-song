import * as eventRepository from "../repositories/eventRepository";

async function createRecommendation(body: Object) {
    await eventRepository.insertRecommendation(body);
}

export { createRecommendation };