import { z } from "zod";
import USER_VALIDATION_MESSAGES from "../../utils/message/user/user.message";
import USER_VALIDATION_REGEX from "../../utils/limit/user/user.limit";
import { Types } from "mongoose";

const otpCount = process.env.OTP_DIGIT_COUNTER || 4;

export const userSchema = z.object({


  name: z
    .string({ message: USER_VALIDATION_MESSAGES.NAME_REQUIRED })
    .trim()
    .regex(USER_VALIDATION_REGEX.USERNAME, {
      message: USER_VALIDATION_MESSAGES.INVALID_USERNAME,
    }),

  email: z
    .string({ message: USER_VALIDATION_MESSAGES.EMAIL_REQUIRED })
    .trim()
    .lowercase()
    .regex(USER_VALIDATION_REGEX.EMAIL, {
      message: USER_VALIDATION_MESSAGES.INVALID_EMAIL,
    }),

  password: z
    .string({ message: USER_VALIDATION_MESSAGES.PASSWORD_REQUIRED })
    .regex(USER_VALIDATION_REGEX.PASSWORD, {
      message: USER_VALIDATION_MESSAGES.INVALID_PASSWORD,
    }),

  profilePicture: z.object({
    url: z.string(),
    public_id: z.string(),
  }),

  phone:z.string().regex(USER_VALIDATION_REGEX.PHONE_NUMBER),

  address:z.string().min(10).max(255),

  isVerified: z.boolean().default(false),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const otpSchema = z.object({
  otp: z
    .string({ message: USER_VALIDATION_MESSAGES.OTP_REQUIRED })
    .length(Number(process.env.OTP_DIGIT_COUNTER) || 4, {
      message: USER_VALIDATION_MESSAGES.INVALID_OTP(otpCount),
    }),
});

export type IUser = z.infer<typeof userSchema> & {
  _id: Types.ObjectId;
};

