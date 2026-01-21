import VALIDATION_MESSAGES from "../message.message";

const USER_VALIDATION_MESSAGES = {
  NAME_REQUIRED: VALIDATION_MESSAGES.REQUIRED("Name"),
  INVALID_USERNAME:
    "Name must be 'First Last' and capitalized (e.g., John Doe)",

  EMAIL_REQUIRED: VALIDATION_MESSAGES.REQUIRED("Email"),
  INVALID_EMAIL: VALIDATION_MESSAGES.INVALID_FORMAT("Email"),

  PASSWORD_REQUIRED: VALIDATION_MESSAGES.REQUIRED("Password"),
  INVALID_PASSWORD:
    "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character",

  OTP_REQUIRED: VALIDATION_MESSAGES.REQUIRED("OTP"),
  INVALID_OTP: (digits: number | string) =>
    VALIDATION_MESSAGES.INVALID_OTP(digits),

  NOT_FOUND: "User not found",
  ALREADY_EXISTS: "User with this email already exists",
  INCORRECT_PASSWORD: "Password is incorrect",
  NOT_VERIFIED: "User is not verified. Please verify your email.",
} as const;

export default USER_VALIDATION_MESSAGES;
