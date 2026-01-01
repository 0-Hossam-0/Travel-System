import { Application, Request, Response } from "express";
import express from "express";
import tourRouter from "./modules/tour/tour.controller";
import hotelRouter from "./modules/hotel/hotel.controller";
import { notFound } from "./middleware/notFound.middleware";
import { globalErrorHandler } from "./utils/response/error.response";
import authRouter from "./modules/authentication/authentication.controller";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./DB/connect";
import {
  capturePayPalOrder,
  createPayPalOrder,
} from "./utils/payment/paypal";

export const bootstrap = (app: Application) => {
  const port = process.env.PORT || 3000;

  connectDB();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server is running!");
  });

  app.post("/order/request", async (req: Request, res: Response) => {
    const { price, description, userId, tourId } = req.body;
    const result = await createPayPalOrder({
      description: description,
      amount: price,
      userId,
      tourId,
    });

    res.status(200).json({
      result,
    });
  });

  app.get("/order/confirm/:orderId", async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const result = await capturePayPalOrder(orderId);

    res.status(200).json({
      result,
    });
  });

  // Module Routes
  app.use("/tours", tourRouter);
  app.use("/hotels", hotelRouter);

  app.use(notFound);

  app.use(globalErrorHandler);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};