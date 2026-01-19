import { updateBasicInfo, getProfileSchema } from './validation/users.schema';
import { Router } from "express";
import * as UserService from "./users.service";
import { cloudFileUpload } from "../../utils/multer/cloud.multer";
import validateRequest from "../../middleware/requestValidation.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

export const usersRouter = Router();

usersRouter.get("/my-profile", validateRequest(getProfileSchema), asyncHandler(UserService.myProfile));

usersRouter.patch(
  "/upload-profile-picture",
  cloudFileUpload().single("image"),
  asyncHandler(UserService.uploadProfilePicture)
);

usersRouter.patch("/update-profile-info", validateRequest(updateBasicInfo), asyncHandler(UserService.updateProfileInfo));