import { Request, Response, Router } from "express";
import { FavoriteService } from "./favorite.service";
import { AuthRequest } from "../../public types/authentication/request.types";
import { successResponse } from "../../utils/response/success.response";
import validateRequest from "../../middleware/requestValidation.middleware";
import { toggleFavoriteValidation } from "./validation/toggleFavorite.validation";
import { authMiddleware } from "../../middleware/auth.middleware";

const FavoriteRoutes = Router();

FavoriteRoutes.post(
  "/toggle",
  authMiddleware,
  validateRequest(toggleFavoriteValidation),
  async (req: Request, res: Response) => {
    const authRequest = req as AuthRequest;
    const userId = authRequest.user._id;
    const { item_id, category } = req.body;

    const result = await FavoriteService.toggleFavorite({
      user_id: userId,
      item_id,
      category,
    });

    const message =
      result.status === "added"
        ? "Added to favorites successfully"
        : "Removed from favorites successfully";

    const statusCode = result.status === "added" ? 201 : 200;

    successResponse(res, {
      statusCode,
      message,
      data: result.data || null,
    });
  }
);

FavoriteRoutes.get(
  "/my-favorites",
  authMiddleware,
  async (req: Request, res: Response) => {
    const authRequest = req as AuthRequest;
    const userId = authRequest.user._id;

    const result = await FavoriteService.getMyFavorites(userId.toString());

    successResponse(res, {
      statusCode: 200,
      message: "Favorites retrieved successfully",
      data: result,
    });
  }
);

export default FavoriteRoutes;
