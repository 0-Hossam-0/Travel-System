import { setTokenCookie } from "./../../utils/cookies/cookies";
import { generateTokens } from "./../../utils/security/token.security";
import { Request, Response } from "express";
import {
  ForgetPasswordConfirm,
  ForgetPasswordRequest,
  LoginRequest,
} from "./types/request.types";
import UserModel from "../../DB/models/user.model";
import { createAndStoreOTP } from "../../utils/otp/create.otp";
import { sendEmail } from "../../utils/email/sendEmail.email";
import { getOTPTemplate } from "../../utils/email/resetPassword.template";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/response/error.response";
import crypto from "crypto";
import { EmailTemplate } from "../../utils/email/email.types";
import { compareHash, hashString } from "../../utils/security/hash.security";
import { successResponse } from "../../utils/response/success.response";
import { Types } from "mongoose";
import { OtpTypes } from "../../utils/otp/otp.types";
import { OTPModel } from "../../DB/models/otp.model";
import bcrypt from "bcrypt";

export const forgetPasswordRequest = async (
  req: ForgetPasswordRequest,
  res: Response
) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) throw new BadRequestException("Invalid email provided");

  const otp = await createAndStoreOTP({
    userId: user._id,
    otpType: OtpTypes.FORGET_PASSWORD,
  });

  const template: EmailTemplate = getOTPTemplate(otp);

  await sendEmail({
    email: user.email,
    ...template,
  });

  return successResponse(res, {
    message: "Verification code sent to your email!",
  });
};

export const forgetPasswordConfirm = async (
  req: ForgetPasswordConfirm,
  res: Response
) => {
  const { otpCode, email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) throw new BadRequestException("Something went wrong.");

  const otp = await OTPModel.findOne({
    userId: user._id,
    isUsed: false,
    type: OtpTypes.FORGET_PASSWORD,
    expiresAt: { $gt: new Date() },
  });

  if (!otp) throw new BadRequestException("Session is invalid or has expired.");

  const isMatch = await bcrypt.compare(otpCode, otp.hashedOtp);

  if (!isMatch) throw new BadRequestException("Invalid Otp code provided.");

  user.password = await hashString(password);
  otp.isUsed = true;

  await otp.save();
  await user.save();

  return successResponse(res, {
    message: "Password updated successfully! You can now log in",
  });
};

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (req: Request, res: Response) => {
  // Register a new user
  const { name, email, password }: IRegisterRequest = req.body;
  if (!name) throw new BadRequestException("No name provided");
  if (!email) throw new BadRequestException("Missing email");
  if (!password) throw new BadRequestException("Missing password");

  const userExists = await UserModel.findOne({ email });
  if (userExists) throw new BadRequestException("Email already registered");

  const hashedPassword = await hashString(password);

  const createdUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // Remove password from response for security
  const userResponse = {
    id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    isVerified: createdUser.isVerified,
    createdAt: createdUser.createdAt,
  };

  return successResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: userResponse,
  });
};

export const login = async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw new NotFoundException("User Not Exist");
  }

  if (!user.isVerified) {
    throw new BadRequestException("Please Verify Your Email To Login");
  }

  if (!(await compareHash(password, user.password as string))) {
    throw new BadRequestException("Email Or Password Incorrect");
  }

  const credentials = generateTokens(user._id as Types.ObjectId);

  setTokenCookie(res, credentials);

  return successResponse(res, {
    info: "Credentials Saved In User Cookies",
  });
};
