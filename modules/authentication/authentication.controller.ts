import { Router } from "express";
import {
  resetPasswordRequest,
  resetPasswordConfirm,
} from "./authentication.service";
import { validateRequest } from "../../middleware/requestValidation/requestValidation.middleware";
import {
  resetPasswordRequestSchema,
  resetPasswordConfirmSchema,
} from "./types/zod.types";

const authRouter = Router();

authRouter.post(
  "/forgot-password/request",
  validateRequest(resetPasswordRequestSchema),
  resetPasswordRequest
);

authRouter.post(
  "/forgot-password/confirm/:token",
  validateRequest(resetPasswordConfirmSchema),
  resetPasswordConfirm
);

export default authRouter;
