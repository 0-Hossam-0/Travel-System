import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { IUser } from "../../schema/user/user.schema";
import { Types } from "mongoose";

export interface AuthRequest extends Request {
  user: IUser & {_id: Types.ObjectId};
  decoded: JwtPayload;
}
