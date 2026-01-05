import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./DB/connect";
import { notFound } from "./middleware/notFound.middleware";
import { globalErrorHandler } from "./utils/response/error.response";
import authRouter from "./modules/authentication/authentication.controller";
import tourRouter from "./modules/tour/tour.controller";
import hotelRouter from "./modules/hotel/hotel.controller";

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/tours", tourRouter);
app.use("/hotels", hotelRouter);
app.use("/api/hotels", hotelRouter);

app.use(notFound);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});