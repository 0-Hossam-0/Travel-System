import express, { Application, Request, Response } from "express";
import tourRouter from "./modules/tour/tour.controller";
import { notFound } from "./middleware/notFound.middleware";
import { globalErrorHandler } from "./utils/response/error.response";
import authRouter from "./modules/authentication/authentication.controller";
import roomRouter from "./modules/room/room.controller";
import hotelRouter from "./modules/hotel/hotel.controller";
import carRouter from "./modules/car/car.controller";
import bookingRouter from "./modules/booking/booking.controller";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./DB/connect";
import cookieParser from "cookie-parser";

const bootstrap = (app: Application) => {
  const port = process.env.PORT || 300;

  connectDB();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api/auth", authRouter);

  app.use("/api/room", roomRouter);

  app.use("/api/hotel", hotelRouter);

  app.use("/api/booking", bookingRouter);
  
  app.use("/api/car", carRouter);

  app.use("/api/tours", tourRouter);

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
