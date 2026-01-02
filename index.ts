import dotenv from "dotenv";
dotenv.config();


import { usersRouter } from './modules/users/users.controller';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./DB/connect";
import { notFound } from "./middleware/notFound.middleware";
import { globalErrorHandler } from "./utils/response/error.response";
import authRouter from "./modules/authentication/authentication.controller";
import cookieParser from 'cookie-parser';


const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

app.use("/users", usersRouter);


app.use(notFound);

app.use(globalErrorHandler);


const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

startServer();