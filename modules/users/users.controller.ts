import { authMiddleware } from "./../../middleware/auth.middleware";
import { Router } from "express";
import { successResponse } from "../../utils/response/success.response";
import { AuthRequest } from "../../public types/authentication/request.types";
import { Response, Request } from "express";

export const usersRouter = Router();

usersRouter.get(
  "/my-profile",
  authMiddleware,
  (req: Request, res: Response) => {
    const authRequest = req as AuthRequest;
    return successResponse(res, {
      data: authRequest.user,
    });
  }
);
