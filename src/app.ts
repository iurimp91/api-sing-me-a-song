import express from "express";
import cors from "cors";

import * as eventController from "./controllers/eventController";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recommendations", eventController.postRecommendation);

app.post("/recommendations/:id/upvote", eventController.recommendationUpVote);

app.post("/recommendations/:id/downvote", eventController.recommendationDownVote);

app.get("/recommendations/random", eventController.getRandomRecommendation);

app.get("/recommendations/top/:amount", eventController.getTopRecommendation);

export default app;
