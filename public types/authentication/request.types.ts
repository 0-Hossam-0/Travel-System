import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { IUser } from "../../schema/user/user.schema";

export interface AuthRequest extends Request {
  user: IUser;
  decoded: JwtPayload;
}