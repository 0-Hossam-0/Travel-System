import { Router } from "express";
import { registerUser } from "./authentication.service";

const authRouter = Router();

authRouter.post("/signup", registerUser);
export default authRouter;