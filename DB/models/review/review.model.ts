import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  user_id: Types.ObjectId;
  category: "Tour" | "Flight" | "Car" | "Hotel";
  item_id: Types.ObjectId;
  rating: number;
  title: string;
  body: string;
  photos_json: string[];
  status: "pending" | "published" | "hidden";
}

const reviewSchema = new Schema<IReview>(
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
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    photos_json: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "published", "hidden"],
      default: "published",
    },
  },
  { timestamps: true }
);

reviewSchema.index({ item_id: 1, category: 1, status: 1 });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
