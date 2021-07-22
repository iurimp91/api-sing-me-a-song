import { Request, Response } from "express";

import { bodyValidation, voteValidation } from "../validations/recommendationValidation";

import * as eventService from "../services/eventService";

async function postRecommendation(req: Request, res: Response) {
    try {
        const validBody = await bodyValidation(req.body);

        await eventService.createRecommendation(validBody);
        
        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        if (e.message.includes("name") || e.message.includes("youtubeLink")) {
            return res.sendStatus(400);
        } else {
            return res.sendStatus(500);
        }
    }
}

async function recommendationUpVote(req: Request, res: Response) {
    try {
        const validVote = await voteValidation(req.params);

        const result = await eventService.vote(validVote);
        
        if (result === false) return res.sendStatus(400);

        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
}

export { postRecommendation, recommendationUpVote };