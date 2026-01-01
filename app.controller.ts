import express, { Application, Request, Response } from "express";
import tourRouter from "./modules/tour/tour.controller";
import { notFound } from "./middleware/notFound.middleware";
import { globalErrorHandler } from "./utils/response/error.response";
import authRouter from "./modules/authentication/authentication.controller";
import paymentRouter from "./modules/payment/payment.routes";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./DB/connect";

const bootstrap = (app: Application) => {
  const port = process.env.PORT || 3000;

  connectDB();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server is running!");
  });
  app.use("/auth", authRouter);

  app.use("/tours", tourRouter);

  app.use("/api/payments", paymentRouter);

  app.use(notFound);

  app.use(globalErrorHandler);

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server is running!");
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

export default bootstrap;
