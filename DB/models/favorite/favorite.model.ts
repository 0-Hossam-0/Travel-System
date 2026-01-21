import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFavorite extends Document {
  user_id: Types.ObjectId;
  category: "Tour" | "Flight" | "Car" | "Hotel";
  item_id: Types.ObjectId;
  added_at: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      required: true,
      enum: ["Tour", "Flight", "Car", "Hotel"],
    },
    item_id: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "category",
    },
    added_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

favoriteSchema.index({ user_id: 1, item_id: 1, category: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
