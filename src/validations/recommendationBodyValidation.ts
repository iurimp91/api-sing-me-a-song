import joi from "joi";
import { stripHtml } from "string-strip-html";

export async function recommendationBodyValidation(body: Object): Promise<Object> {
    const schema = joi.object({
        name: joi.string().min(3).trim().required(),
        youtubeLink: joi.string().uri().required()
    });

    const validBody = await schema.validateAsync(body);

    return {
        name: stripHtml(validBody.name).result.trim(),
        youtubeLink: stripHtml(validBody.youtubeLink).result.trim(),
    };
}