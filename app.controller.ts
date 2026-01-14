import { mainRoute } from "./middleware/main.route";
import { usersRouter } from "./modules/users/users.controller";
import express, { Application, Request, Response } from "express";
import tourRouter from "./modules/tour/tour.controller";
import { notFound } from "./middleware/notFound.middleware";
import { globalErrorHandler } from "./utils/response/error.response";
import authRouter from "./modules/authentication/authentication.controller";
import roomRouter from "./modules/room/room.controller";
import hotelRouter from "./modules/hotel/hotel.controller";
import carRouter from "./modules/car/car.controller";
import bookingRouter from "./modules/booking/booking.controller";
import favoriteRouter from "./modules/favorite/favorite.controller";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./DB/connect";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware/auth.middleware";

const bootstrap = (app: Application) => {
  const port = process.env.PORT || 300;

  connectDB();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api/auth", authRouter);

  app.use("/api/users", authMiddleware, usersRouter);

  app.use("/api/room", roomRouter);

  app.use("/api/hotel", hotelRouter);

  app.use("/api/booking", bookingRouter);

  app.use("/api/car", carRouter);

  app.use("/api/tours", tourRouter);

  app.use("/api/favorite", favoriteRouter);

  app.get(["/", "/api"], mainRoute);

  app.use(notFound);

  app.use(globalErrorHandler);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

export default bootstrap;
