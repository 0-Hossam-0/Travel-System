import mongoose, { Schema, Document, Types } from "mongoose";
import { ITourPriceTier } from "../../../schema/tour/tourPriceTier.schema";

export interface ITourPriceTierDocument extends ITourPriceTier, Document {}

const tourPriceTierSchema = new Schema<ITourPriceTierDocument>(
  {
    tour_id: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    name: { type: String, required: true },
    adult_price: { type: Number, required: true, min: 0 },
    child_price: { type: Number, default: 0, min: 0 },
    infant_price: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const TourPriceTierModel = mongoose.model<ITourPriceTierDocument>(
  "Tour-Price-Tier",
  tourPriceTierSchema
);

export default TourPriceTierModel;
