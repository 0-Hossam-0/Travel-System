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
import { asyncHandler } from "../../utils/asyncHandler";

const authRouter = Router();

authRouter.post(
  "/forgot-password/request",
  validateRequest(resetPasswordRequestSchema),
  asyncHandler(forgetPasswordRequest)
);

authRouter.post(
  "/forgot-password/confirm/:token",
  validateRequest(resetPasswordConfirmSchema),
  asyncHandler(forgetPasswordConfirm)
);

authRouter.post("/signup", validateRequest(SignupSchema), asyncHandler(registerUser));

authRouter.post("/login", validateRequest(LoginSchema), asyncHandler(login));

authRouter.get("/refresh", asyncHandler(refreshToken));

export default authRouter;
