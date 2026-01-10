import { Document, Schema, model } from "mongoose";
import { IUser } from "../../../schema/user/user.schema";
import USER_VALIDATION_MESSAGES from "../../../utils/message/user/user.message";
import USER_VALIDATION_REGEX from "../../../utils/limit/user/user.limit";

interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, USER_VALIDATION_MESSAGES.NAME_REQUIRED],
      trim: true,
      match: [
        USER_VALIDATION_REGEX.USERNAME,
        USER_VALIDATION_MESSAGES.INVALID_USERNAME,
      ],
    },
    email: {
      type: String,
      required: [true, USER_VALIDATION_MESSAGES.EMAIL_REQUIRED],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        USER_VALIDATION_REGEX.EMAIL,
        USER_VALIDATION_MESSAGES.INVALID_EMAIL,
      ],
    },
    password: {
      type: String,
      required: [true, USER_VALIDATION_MESSAGES.PASSWORD_REQUIRED],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUserDocument>("User", userSchema);

export default UserModel;
