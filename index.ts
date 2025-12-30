import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./DB/connect";
import { notFound } from "./middleware/not-found";
import { bootstrap } from "./app.controller";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

bootstrap(app);

import { globalErrorHandler } from "./utils/response/error.response";

app.use(notFound);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
