import { z } from "zod";
import USER_VALIDATION_MESSAGES from "../../utils/message/user/user.message";
import USER_VALIDATION_REGEX from "../../utils/limit/user/user.limit";

const otpCount = process.env.OTP_DIGIT_COUNTER || 4;

export const userSchema = z.object({
  name: z
    .string({ message: USER_VALIDATION_MESSAGES.NAME_REQUIRED })
    .trim()
    .regex(USER_VALIDATION_REGEX .USERNAME, {
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

export type IUser = z.infer<typeof userSchema>;
