import { Types } from "mongoose";

export const OtpTypes = Object.freeze({
  FORGET_PASSWORD: "FORGET_PASSWORD",
  LOGIN: "LOGIN",
});

export interface CreateAndStoreOtpProps {
  userId: Types.ObjectId;
  otpType: typeof OtpTypes.LOGIN | typeof OtpTypes.FORGET_PASSWORD;
}
