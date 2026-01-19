import { Router } from "express";
import { FavoriteService } from "./favorite.service";
import validateRequest from "../../middleware/requestValidation.middleware";
import { toggleFavoriteValidation } from "./validation/toggleFavorite.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const FavoriteRoutes = Router();

FavoriteRoutes.post(
  "/toggle",
  authMiddleware,
  validateRequest(toggleFavoriteValidation),
  asyncHandler(FavoriteService.toggleFavoriteController)
);

FavoriteRoutes.get(
  "/my-favorites",
  authMiddleware,
  asyncHandler(FavoriteService.getMyFavoritesController)
);

export default FavoriteRoutes;
