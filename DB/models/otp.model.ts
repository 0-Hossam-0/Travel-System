import { Schema, Types, model, Document } from "mongoose";
import { OtpTypes } from "../../utils/otp/otp.types";

interface IOTP extends Document {
  userId: Types.ObjectId;
  hashedOtp: string;
  type: string;
  isUsed: boolean;
  expiresAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    hashedOtp: {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(OtpTypes),
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export const OTPModel = model<IOTP>("OTP", otpSchema);
