import UserModel, { IUser } from "../../DB/models/user.model";
import { IRequest } from "../../types/request.types";
import { deleteImageFromCloudinary } from "../../utils/cloudinary/cloudinary.delete";
import { uploadToCloudinary } from "../../utils/cloudinary/cloudinary.upload";
import { ApplicationException } from "../../utils/response/error.response";
import { successResponse } from "./../../utils/response/success.response";
import { Response } from "express";

export const myProfile = async (req: IRequest, res: Response) => {
  return successResponse(res, {
    data: req.credentials?.user,
  });
};

export const uploadProfilePicture = async (req: IRequest, res: Response) => {
  const { secure_url, public_id } = await uploadToCloudinary(
    req.file as Express.Multer.File,
    `Travel System/users/${req.credentials?.user?._id}/profile-pictures`
  );

  if (!secure_url || !public_id) {
    throw new ApplicationException("Fail to upload image");
  }

  const user = (await UserModel.findById(req.credentials?.user?._id)) as IUser;

  if (
    user?.profilePicture?.public_id &&
    user?.profilePicture?.public_id.length
  ) {
    deleteImageFromCloudinary(user.profilePicture.public_id);
  }

  const updated = await UserModel.updateOne(
    {
      _id: user._id,
    },
    {
      $set: {
        profilePicture: {
          public_id,
          url: secure_url,
        },
      },
    }
  );

  if (!updated.modifiedCount) {
    deleteImageFromCloudinary(public_id);
    throw new ApplicationException("Fail To Upload Profile Picture");
  }

  return successResponse(res, {
    data: { secure_url, public_id },
  });
};
