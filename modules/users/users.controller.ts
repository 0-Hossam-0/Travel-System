import { updateBasicInfo, getProfileSchema } from './validation/users.schema';
import { Router } from "express";
import * as UserService from "./users.service";
import { cloudFileUpload } from "../../utils/multer/cloud.multer";
import validateRequest from "../../middleware/requestValidation.middleware";

export const usersRouter = Router();

usersRouter.get("/my-profile", validateRequest(getProfileSchema), UserService.myProfile);

usersRouter.patch(
  "/upload-profile-picture",
  cloudFileUpload().single("image"),
  UserService.uploadProfilePicture
);

usersRouter.patch("/update-profile-info", validateRequest(updateBasicInfo), UserService.updateProfileInfo);