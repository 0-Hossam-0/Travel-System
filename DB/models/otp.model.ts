import { Schema, model, Document } from "mongoose";
import { OtpTypes } from "../../utils/otp/otp.types";

interface IOTP extends Document {
  userId: Schema.Types.ObjectId;
  otp: string;
  type: typeof OtpTypes;
  expiresAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
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
