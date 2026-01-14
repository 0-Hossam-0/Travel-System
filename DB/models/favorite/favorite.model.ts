import mongoose, { Schema } from "mongoose";
import FAVORITE_VALIDATION_MESSAGES from "../../../utils/message/favorite/favorite.message";
import { IFavorite } from "../../../schema/favorite/favorite.schema";

const favoriteSchema = new Schema<IFavorite>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, FAVORITE_VALIDATION_MESSAGES.USER_REQUIRED],
    },
    category: {
      type: String,
      required: [true, FAVORITE_VALIDATION_MESSAGES.CATEGORY_REQUIRED],
      enum: {
        values: ["Tour", "Flight", "Car", "Hotel"],
        message: FAVORITE_VALIDATION_MESSAGES.CATEGORY_INVALID,
      },
    },
    item_id: {
      type: Schema.Types.ObjectId,
      required: [true, FAVORITE_VALIDATION_MESSAGES.ITEM_REQUIRED],
      refPath: "category",
    },
    added_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

favoriteSchema.index({ user_id: 1, item_id: 1, category: 1 }, { unique: true });

export const FavoriteModel = mongoose.model<IFavorite>(
  "Favorite",
  favoriteSchema
);
