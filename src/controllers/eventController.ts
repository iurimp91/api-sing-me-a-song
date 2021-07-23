import { Request, Response } from "express";

import { bodyValidation, voteValidation } from "../validations/recommendationValidation";

import * as eventService from "../services/eventService";

async function postRecommendation(req: Request, res: Response) {
    try {
        const validBody = await bodyValidation(req.body);

        await eventService.createRecommendation(validBody);
        
        return res.sendStatus(200);
    } catch (e) {
        const status = sendError(e);
        return res.sendStatus(status);
    }
}

async function recommendationUpVote(req: Request, res: Response) {
    try {
        const validVote = await voteValidation(req.params);
        
        const result = await eventService.upVote(validVote);
        
        if (result === false) return res.sendStatus(400);

        return res.sendStatus(200);
    } catch (e) {
        const status = sendError(e);
        return res.sendStatus(status);
    }
}

async function recommendationDownVote(req: Request, res: Response) {
    try {
        const validVote = await voteValidation(req.params);
        
        const result = await eventService.downVote(validVote);
        
        if (result === false) return res.sendStatus(400);

        return res.sendStatus(200);
    } catch (e) {
        const status = sendError(e);
        return res.sendStatus(status);
    }
}

async function getRandomRecommendation(eq: Request, res: Response) {
    try {
        const result = await eventService.getRandomRecommendation();

        return res.sendStatus(200);
    } catch (e) {
        const status = sendError(e);
        return res.sendStatus(status);
    }
}

function sendError(e: Error): number {
    console.log(e);
    if (
        e.message.includes("name")
        || e.message.includes("youtubeLink")
        || e.message.includes("id")
    ) {
        return 400;
    } else {
        return 500;
    }
}

export {
    postRecommendation,
    recommendationUpVote,
    recommendationDownVote,
    getRandomRecommendation 
};