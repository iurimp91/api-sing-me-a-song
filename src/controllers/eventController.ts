import { Request, Response } from "express";

import { bodyValidation, voteValidation, amountValidation } from "../validations/recommendationValidation";

import * as eventService from "../services/eventService";

import { Body, VoteParams, AmountParams } from "../interfaces/interfaces";

async function postRecommendation(req: Request, res: Response) {
    try {
        const body: Body = req.body;
        const recommendation = await bodyValidation(body);

        await eventService.createRecommendation(recommendation);
        
        return res.sendStatus(200);
    } catch (e) {
        const status = getErrorStatus(e);
        return res.sendStatus(status);
    }
}

async function recommendationUpVote(req: Request, res: Response) {
    try {
        const params: VoteParams = { id: Number(req.params.id) };
        const id = await voteValidation(params);
        
        const result = await eventService.upVote(id);
        
        if (result === false) return res.sendStatus(400);

        return res.sendStatus(200);
    } catch (e) {
        const status = getErrorStatus(e);
        return res.sendStatus(status);
    }
}

async function recommendationDownVote(req: Request, res: Response) {
    try {
        const params: VoteParams = { id: Number(req.params.id) };
        const id = await voteValidation(params);
        
        const result = await eventService.downVote(id);
        
        if (result === false) return res.sendStatus(400);

        return res.sendStatus(200);
    } catch (e) {
        const status = getErrorStatus(e);
        return res.sendStatus(status);
    }
}

async function getRandomRecommendation(req: Request, res: Response) {
    try {
        const result = await eventService.getRandomRecommendation();

        return result === 404 ? res.sendStatus(404) : res.send(result);
    } catch (e) {
        const status = getErrorStatus(e);
        return res.sendStatus(status);
    }
}

async function getTopRecommendation(req: Request, res: Response) {
    try {
        const params: AmountParams = { amount: Number(req.params.amount) };
        const validAmount = await amountValidation(params);

        const result = await eventService.getTopRecommendation(validAmount);

        return result === 404 ? res.sendStatus(404) : res.send(result);
    } catch (e) {
        const status = getErrorStatus(e);
        return res.sendStatus(status);
    }
}

function getErrorStatus(e: Error): number {
    console.log(e);
    if (
        e.message.includes("name")
        || e.message.includes("youtubeLink")
        || e.message.includes("id")
        || e.message.includes("amount")
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
    getRandomRecommendation,
    getTopRecommendation
};