import express from "express";
import cors from "cors";

import * as eventController from "./controllers/eventController";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recommendations", eventController.postRecommendation);

app.post("/recommendations/:id/upvote", eventController.recommendationUpVote);

export default app;
