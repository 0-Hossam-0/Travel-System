import { authMiddleware } from "./../../middleware/auth.middleware";
import { Router } from "express";
import * as usersService from "./users.service";
import { cloudFileUpload } from "../../utils/multer/cloud.multer";
import { validateFileUploaded } from "../../middleware/requestValidation/requestValidation.middleware";

export const usersRouter = Router();

usersRouter.get("/my-profile", authMiddleware, usersService.myProfile);

usersRouter.patch(
  "/upload-profile-picture",
  authMiddleware,
  cloudFileUpload().single("image"),
  validateFileUploaded,
  usersService.uploadProfilePicture
);