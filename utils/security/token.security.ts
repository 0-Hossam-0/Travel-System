import jwt, { SignOptions, JwtPayload, Secret } from "jsonwebtoken";
import { Types } from "mongoose";
import UserModel from "../../DB/models/user/user.model";
import {
  NotFoundException,
  UnAuthorizedException,
} from "../response/error.response";
import TokenType from "../../public types/authentication/token.types";
import { IUser } from "../../schema/user/user.schema";
import { AuthRequest } from "../../public types/authentication/request.types";

const getTokenConfig = (tokenType: TokenType) => {
  return tokenType === TokenType.ACCESS
    ? {
        key: process.env.ACCESS_TOKEN_KEY || "ACCESS_TOKEN_KEY",
        secret: process.env.ACCESS_TOKEN_SECRET || "ACCESS_TOKEN_SECRET",
        duration: process.env.ACCESS_TOKEN_DURATION || "15m",
      }
    : {
        key: process.env.REFRESH_TOKEN_KEY || "REFRESH_TOKEN_KEY",
        secret: process.env.REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET",
        duration: process.env.REFRESH_TOKEN_DURATION || "7d",
      };
};

export const generateToken = (
  userId: Types.ObjectId,
  tokenType: TokenType
): string => {
  const tokenConfig = getTokenConfig(tokenType);

  const payload = { _id: userId };

  const options: SignOptions = {
    expiresIn: tokenConfig.duration as any,
  };

  return jwt.sign(payload, tokenConfig.secret as Secret, options);
};

export const verifyToken = async (
  token: string,
  type: TokenType = TokenType.ACCESS
) => {
  const secret =
    type === TokenType.REFRESH
      ? process.env.REFRESH_TOKEN_SECRET
      : process.env.ACCESS_TOKEN_SECRET;

  if (!secret) throw new UnAuthorizedException("Token secret is missing");

  const decoded = jwt.verify(token, secret) as JwtPayload;

  if (!decoded?._id || !decoded?.iat)
    throw new UnAuthorizedException("Invalid token payload");

  const user = await UserModel.findById(decoded._id);

  if (!user) throw new NotFoundException("Invalid User Id decoded from token");

  return { user, decoded };
};
