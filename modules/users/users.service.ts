import { ApplicationException, BadRequestException } from "./../../utils/response/error.response";
import { successResponse } from "./../../utils/response/success.response";
import { Request, Response } from "express";
import { AuthRequest } from "./../../public types/authentication/request.types";
import { uploadToCloudinary } from "../../utils/cloudinary/cloudinary.upload";
import { deleteImageFromCloudinary } from "../../utils/cloudinary/cloudinary.delete";
import UserModel from "../../DB/models/user/user.model";
import { IUser } from "../../schema/user/user.schema";

export const myProfile = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  return successResponse(res, {
    data: { userData: authReq.user },
  });
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  if(!req.file){
    throw new BadRequestException("No Attachment Uploaded !");
  }

  const { secure_url, public_id } = await uploadToCloudinary(
    req.file as Express.Multer.File,
    `Travel System/users/${authReq.user._id}/profile-pictures`
  );

  if (!secure_url || !public_id) {
    throw new ApplicationException("Fail to upload image");
  }

  const user = (await UserModel.findById(authReq.user._id)) as IUser;

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
    message: "Profile Picture Updated Success",
    data: { secure_url, public_id },
  });
};

export const updateProfileInfo = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  const data = authReq.body;

  const duplicatedIssues: { path: string; issue: string }[] = [];

  const keys: (keyof IUser)[] = ["name", "address", "phone"];


  keys.forEach((key) => {
    if (data[key] !== undefined && data[key] === authReq.user![key]) {
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
      _id: { $ne: authReq.user._id },
    })
  ) {
    throw new BadRequestException("This phone number is already in use by another user.");
  }

  const updated = await UserModel.updateOne(
    {
      _id: authReq.user!._id,
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
