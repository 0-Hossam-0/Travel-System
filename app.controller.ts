import { Application, Request, Response } from "express";
import tourRouter from "./modules/tour/tour.controller";
import hotelRouter from "./modules/hotel/hotel.controller";
export const bootstrap = (app: Application) => {
  // Root Check
  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server is running!");
  });

  // Module Routes
  app.use("/tours", tourRouter);
  // 
  app.use("/hotels", hotelRouter);
};

  