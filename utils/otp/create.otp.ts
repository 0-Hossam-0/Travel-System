import crypto from "crypto";
import bcrypt from "bcrypt";
import ms, { StringValue } from "ms";
import { OTPModel } from "../../DB/models/otp.model";
import { CreateAndStoreOtpProps } from "../otp/otp.types";

export const createAndStoreOTP = async ({
  userId,
  otpType,
}: CreateAndStoreOtpProps): Promise<string> => {
  const length = Number(process.env.OTP_DIGIT_COUNTER || 4);
  const max = Math.pow(10, length);
  const rawOtp = crypto.randomInt(0, max).toString().padStart(length, "0");

  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(rawOtp, salt);

  const expirationString = (process.env.OTP_EXPIRATION || "10m") as StringValue;
  const otpExpirationMs = ms(expirationString);
  const expiresAt = new Date(Date.now() + otpExpirationMs);

  await OTPModel.create({
    userId: userId,
    hashedOtp: hashedOtp,
    isUsed: false,
    expiresAt: expiresAt,
    type: otpType,
  });

  return rawOtp;
};
