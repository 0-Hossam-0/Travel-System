import { AuthRequest } from "../public types/authentication/request.types";
import {
  ForbiddenException,
  UnAuthorizedException,
} from "./../utils/response/error.response";
import { verifyToken } from "./../utils/security/token.security";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest;
    const accessTokenKey = process.env.ACCESS_TOKEN_KEY as string;
    const accessToken = authReq.cookies[accessTokenKey];
    if (!accessToken)
      throw new UnAuthorizedException("Unauthorized - Access token missing");

    const { user, decoded } = await verifyToken(accessToken);

    authReq.user = user;
    authReq.decoded = decoded;

    next();
  } catch (error) {
    throw new ForbiddenException("Unauthorized - Invalid or expired token");
  }
};
