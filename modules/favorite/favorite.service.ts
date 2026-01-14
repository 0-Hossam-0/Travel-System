import { FavoriteModel } from "../../DB/models/favorite/favorite.model";
import { IFavorite } from "../../schema/favorite/favorite.schema";

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

export const FavoriteService = {
  toggleFavorite,
  getMyFavorites,
};
