import { IUser } from './../../DB/models/user.model';
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Types } from "mongoose";
import UserModel from "../../DB/models/user.model";
import { NotFoundException } from "../response/error.response";

/* ================== Types ================== */

export enum TokenType {
  access = "access",
  refresh = "refresh",
}

/* ================== Generate Access & Refresh ================== */

export const generateTokens = (
  userId: Types.ObjectId
): { access_token: string; refresh_token: string } => {
  const accessSecret = process.env.ACCESS_TOKEN_SECRET as Secret;
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET as Secret;

  if (!accessSecret || !refreshSecret) {
    throw new Error("Token secrets are missing");
  }

  const access_token = jwt.sign({ _id: userId }, accessSecret, {
    expiresIn: "1h",
  });

  const refresh_token = jwt.sign({ _id: userId }, refreshSecret, {
    expiresIn: "1y",
  });

  return { access_token, refresh_token };
};

/* ================== Verify Token ================== */

export const verifyToken = async (
  token: string,
  type: TokenType = TokenType.access
): Promise<{decoded:JwtPayload,user:IUser}> => {
  const secret =
    type === TokenType.refresh
      ? (process.env.REFRESH_TOKEN_SECRET as Secret)
      : (process.env.ACCESS_TOKEN_SECRET as Secret);

  if (!secret) {
    throw new Error("Token secret is missing");
  }

  const decoded = jwt.verify(token, secret) as JwtPayload;

  if (!decoded?._id || !decoded?.iat) {
    throw new Error("Invalid token payload");
  }

  const user = await UserModel.findById(decoded._id);

  if (!user) {
    throw new NotFoundException("Invalid User Id decoded from token");
  }

  return {user,decoded};
};
