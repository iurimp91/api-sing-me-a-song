import joi from "joi";
import { stripHtml } from "string-strip-html";

const youtubeRegEx = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

export async function bodyValidation(body: Object): Promise<Object> {
    const schema = joi.object({
        name: joi.string().min(3).trim().required(),
        youtubeLink: joi.string().uri().pattern(youtubeRegEx).required()
    });

    const validBody = await schema.validateAsync(body);

    return {
        name: stripHtml(validBody.name).result.trim(),
        youtubeLink: stripHtml(validBody.youtubeLink).result.trim(),
    };
}

export async function voteValidation(params: Object): Promise<Number> {
    const schema = joi.object({
        id: joi.number().integer().min(1).required()
    });

    const validParams = await schema.validateAsync(params);
    
    return validParams.id;
}

export async function amountValidation(params: Object): Promise<Number> {
    const schema = joi.object({
        amount: joi.number().integer().min(1).required()
    });

    const validParams = await schema.validateAsync(params);
    
    return validParams.amount;
}