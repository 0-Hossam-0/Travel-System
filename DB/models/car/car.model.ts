import mongoose, { Schema, Document } from "mongoose";
import { ICar } from "../../../schema/car/car.schema";
import { CAR_VALIDATION_MESSAGES } from "../../../utils/message/car/car.message";
import { CAR_VALIDATION_LIMITS } from "../../../utils/limit/car/car.limit";

export interface ICarDocument extends ICar, Document {}

const carSchema = new Schema<ICarDocument>(
  {
    brand: {
      type: String,
      required: [true, CAR_VALIDATION_MESSAGES.BRAND_REQUIRED],
      trim: true,
      minlength: [CAR_VALIDATION_LIMITS.BRAND.MIN, CAR_VALIDATION_MESSAGES.BRAND_MIN],
      maxlength: [CAR_VALIDATION_LIMITS.BRAND.MAX, CAR_VALIDATION_MESSAGES.BRAND_MAX],
    },
    carModel: {
      type: String,
      required: [true, CAR_VALIDATION_MESSAGES.MODEL_REQUIRED],
      trim: true,
      minlength: [CAR_VALIDATION_LIMITS.MODEL.MIN, CAR_VALIDATION_MESSAGES.MODEL_MIN],
      maxlength: [CAR_VALIDATION_LIMITS.MODEL.MAX, CAR_VALIDATION_MESSAGES.MODEL_MAX],
    },
    year: {
      type: Number,
      required: [true, CAR_VALIDATION_MESSAGES.YEAR_REQUIRED],
      min: [CAR_VALIDATION_LIMITS.YEAR.MIN, CAR_VALIDATION_MESSAGES.YEAR_MIN],
      max: [CAR_VALIDATION_LIMITS.YEAR.MAX, CAR_VALIDATION_MESSAGES.YEAR_MAX],
    },
    color: {
      type: String,
      required: [true, CAR_VALIDATION_MESSAGES.COLOR_REQUIRED],
      trim: true,
    },
    price_per_day: {
      type: Number,
      required: [true, CAR_VALIDATION_MESSAGES.PRICE_REQUIRED],
      min: [CAR_VALIDATION_LIMITS.PRICE_PER_DAY.MIN, CAR_VALIDATION_MESSAGES.PRICE_MIN],
    },
    seats: {
      type: Number,
      required: [true, CAR_VALIDATION_MESSAGES.SEATS_REQUIRED],
      min: [CAR_VALIDATION_LIMITS.SEATS.MIN, CAR_VALIDATION_MESSAGES.SEATS_MIN],
      max: [CAR_VALIDATION_LIMITS.SEATS.MAX, CAR_VALIDATION_MESSAGES.SEATS_MAX],
    },
    has_ac: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

carSchema.index({ brand: 1, model: 1, price_per_day: 1 });

export const CarModel = mongoose.model<ICarDocument>("Car", carSchema);
