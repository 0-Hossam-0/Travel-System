import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./DB/connect";
import { notFound } from "./middleware/not-found";
import paymentRouter from "./modules/payment/payment.routes";

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running!");
});

app.use("/api/payments", paymentRouter);

app.use(notFound);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
