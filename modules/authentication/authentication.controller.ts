import { Router } from "express";
import {
  forgetPasswordRequest,
  forgetPasswordConfirm,
  login,
} from "./authentication.service";
import { validateRequest } from "../../middleware/requestValidation/requestValidation.middleware";
import {
  resetPasswordRequestSchema,
  resetPasswordConfirmSchema,
  LoginSchema,
} from "./types/zod.types";
import { registerUser } from "./authentication.service";

const authRouter = Router();

authRouter.post(
  "/forgot-password/request",
  validateRequest(resetPasswordRequestSchema),
  forgetPasswordRequest
);

authRouter.post(
  "/forgot-password/confirm/:token",
  validateRequest(resetPasswordConfirmSchema),
  forgetPasswordConfirm
);

authRouter.post("/signup", registerUser);

authRouter.post("/login", validateRequest(LoginSchema), login);
export default authRouter;
