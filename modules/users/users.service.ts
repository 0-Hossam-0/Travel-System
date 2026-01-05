import UserModel, { IUser } from "../../DB/models/user.model";
import { IRequest } from "../../types/request.types";
import { deleteImageFromCloudinary } from "../../utils/cloudinary/cloudinary.delete";
import { uploadToCloudinary } from "../../utils/cloudinary/cloudinary.upload";
import {
  ApplicationException,
  BadRequestException,
} from "../../utils/response/error.response";
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

export const updateProfileInfo = async (req: IRequest, res: Response) => {
  const data = req.body;

  const duplicatedIssues: { path: string; issue: string }[] = [];

  const keys: (keyof IUser)[] = ["name", "address", "phone"];

  keys.forEach((key) => {
    if (data[key] !== undefined && data[key] === req.credentials?.user![key]) {
      duplicatedIssues.push({
        path: key,
        issue: `The new ${key} cannot be the same as your current ${key}.`,
      });
    }
  });

  if (duplicatedIssues.length) {
    throw new BadRequestException(
      "Fail to update profile info.",
      duplicatedIssues
    );
  }

  if (
    await UserModel.findOne({
      phone: data.phone,
      _id: { $ne: req.credentials!.user!._id },
    })
  ) {
    throw new BadRequestException("This phone number is already in use by another user.");
  }

  const updated = await UserModel.updateOne(
    {
      _id: req.credentials!.user!._id,
    },
    {
      $set: {
        ...data,
      },
    }
  );

  if (!updated.modifiedCount) {
    throw new ApplicationException("Fail to update your info");
  }

  return successResponse(res, {
    message: "Your profile info updated successfully.",
  });
};