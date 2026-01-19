import { Request, Response } from "express";
import { FavoriteModel } from "../../DB/models/favorite/favorite.model";
import { IFavorite } from "../../schema/favorite/favorite.schema";
import { AuthRequest } from "../../public types/authentication/request.types";
import { successResponse } from "../../utils/response/success.response";

const toggleFavorite = async (payload: Partial<IFavorite>) => {
  const { user_id, item_id, category } = payload;

  const isExist = await FavoriteModel.findOne({ user_id, item_id, category });

  if (isExist) {
    await FavoriteModel.findByIdAndDelete(isExist._id);
    return { status: "removed" };
  } else {
    const result = await FavoriteModel.create(payload);
    return { status: "added", data: result };
  }
};

const getMyFavorites = async (userId: string) => {
  const result = await FavoriteModel.find({ user_id: userId })
    .populate("item_id")
    .sort("-added_at");

  return result;
};

/**
 * Controller Service: Toggle Favorite
 * Handles the complete request/response flow for toggling favorites
 */
const toggleFavoriteController = async (req: Request, res: Response) => {
  const authRequest = req as AuthRequest;
  const userId = authRequest.user._id;
  const { item_id, category } = req.body;

  const result = await toggleFavorite({
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
};

/**
 * Controller Service: Get My Favorites
 * Handles the complete request/response flow for retrieving user favorites
 */
const getMyFavoritesController = async (req: Request, res: Response) => {
  const authRequest = req as AuthRequest;
  const userId = authRequest.user._id;

  const result = await getMyFavorites(userId.toString());

  successResponse(res, {
    statusCode: 200,
    message: "Favorites retrieved successfully",
    data: result,
  });
};

export const FavoriteService = {
  toggleFavorite,
  getMyFavorites,
  toggleFavoriteController,
  getMyFavoritesController,
};
