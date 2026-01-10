import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICarPricingTier extends Document {
  car_id: Types.ObjectId;
  from_hours: number;
  to_hours: number;
  price: number;
}

const carPricingTierSchema = new Schema<ICarPricingTier>(
  {
    car_id: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    from_hours: { type: Number, required: true, min: 0 },
    to_hours: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

carPricingTierSchema.index(
  { car_id: 1, from_hours: 1, to_hours: 1 },
  { unique: true }
);

export const CarPricingTier = mongoose.model<ICarPricingTier>(
  "Car-Pricing-Tier",
  carPricingTierSchema
);
