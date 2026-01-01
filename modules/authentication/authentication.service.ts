import { Request, Response } from "express";
import { ForgetPasswordRequest } from "./types/request.types";
import UserModel from "../../DB/models/user.model";
import { createRandomToken } from "../../utils/security/jwtToken.security";
import { sendEmail } from "../../utils/response/email/sendEmail.email";
import { getResetPasswordTemplate } from "../../utils/response/email/resetPassword.template";
import { BadRequestException } from "../../utils/response/error.response";
import crypto from "crypto";
import { EmailTemplate } from "../../utils/response/email/email.types";
import { hashString } from "../../utils/security/hash.security";
import { successResponse } from "../../utils/response/success.response";

export const resetPasswordRequest = async (
  req: ForgetPasswordRequest,
  res: Response
) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) throw new BadRequestException("Invalid email provided");

  const resetToken = createRandomToken();

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const template: EmailTemplate = getResetPasswordTemplate(resetUrl);

  await sendEmail({
    email: user.email,
    ...template,
  });
  return successResponse(res, { message: "Reset link sent to your email!" });
};

export const resetPasswordConfirm = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user)
    throw new BadRequestException("Session is invalid or has expired.");

  user.password = await hashString(password);

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  return successResponse(res, {
    message: "Password updated successfully! You can now log in",
  });
};
