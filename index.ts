import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bootstrap from "./app.controller";

const app = express();
bootstrap(app);