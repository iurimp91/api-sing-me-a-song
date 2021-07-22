import { Request, Response } from "express";

import { recommendationBodyValidation } from "../validations/recommendationBodyValidation";
import * as eventService from "../services/eventService";

async function postRecommendation(req: Request, res: Response) {
    try {
        const bodyValidation = await recommendationBodyValidation(req.body);

        await eventService.createRecommendation(bodyValidation);
        
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

export { postRecommendation };