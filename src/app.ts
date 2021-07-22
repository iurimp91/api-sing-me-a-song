import express from "express";
import cors from "cors";

import * as eventController from "./controllers/eventController";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("OK!");
});

app.post("/recommendations", eventController.postRecommendation);

export default app;
