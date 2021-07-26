export interface Body {
    name: string,
    youtubeLink: string,
}

export interface VoteParams {
    id: number,
}

export interface RecommendationBody {
    id: number,
    name: string,
    youtubeLink: string,
    score: number,
}