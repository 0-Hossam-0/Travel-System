import express from "express";
import dotenv from "dotenv";
import bootstrap from "./app.controller";

dotenv.config();
const app = express();
bootstrap(app);
