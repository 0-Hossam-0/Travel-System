import { Router } from "express";
import {
  forgetPasswordRequest,
  forgetPasswordConfirm,
  login,
} from "./authentication.service";
import validateRequest from "../../middleware/requestValidation.middleware";
import {
  resetPasswordRequestSchema,
  resetPasswordConfirmSchema,
  LoginSchema,
  SignupSchema,
} from "./types/authentication.schema";
import { registerUser, refreshToken } from "./authentication.service";

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

authRouter.post("/signup", validateRequest(SignupSchema), registerUser);

authRouter.post("/login", validateRequest(LoginSchema), login);

authRouter.get("/refresh", refreshToken);

export default authRouter;
