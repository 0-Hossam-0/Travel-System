import mongoose, { Schema, Document } from "mongoose";
import { IHotel } from "../../../schema/hotel/hotel.schema";
import { HOTEL_VALIDATION_LIMITS } from "../../../utils/limit/hotel/hotel.limit";
import { HOTEL_VALIDATION_MESSAGES } from "../../../utils/message/hotel/hotel.message";

export interface IHotelDocument extends IHotel, Document {}

const hotelSchema = new Schema<IHotelDocument>(
  {
    name: {
      type: String,
      required: [true, HOTEL_VALIDATION_MESSAGES.NAME_REQUIRED],
      trim: true,
      minlength: [
        HOTEL_VALIDATION_LIMITS.NAME.MIN,
        HOTEL_VALIDATION_MESSAGES.NAME_MIN,
      ],
      maxlength: [
        HOTEL_VALIDATION_LIMITS.NAME.MAX,
        HOTEL_VALIDATION_MESSAGES.NAME_MAX,
      ],
    },
    location: {
      type: String,
      required: [true, HOTEL_VALIDATION_MESSAGES.LOCATION_REQUIRED],
      index: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, HOTEL_VALIDATION_MESSAGES.ADDRESS_REQUIRED],
      trim: true,
      minlength: [
        HOTEL_VALIDATION_LIMITS.ADDRESS.MIN,
        HOTEL_VALIDATION_MESSAGES.ADDRESS_MIN,
      ],
      maxlength: [
        HOTEL_VALIDATION_LIMITS.ADDRESS.MAX,
        HOTEL_VALIDATION_MESSAGES.ADDRESS_MAX,
      ],
    },
    main_image: {
      type: String,
      required: [true, HOTEL_VALIDATION_MESSAGES.IMAGE_REQUIRED],
      trim: true,
    },
    amenities_json: {
      type: Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (v: any) {
          return v && typeof v === "object" && !Array.isArray(v);
        },
        message: HOTEL_VALIDATION_MESSAGES.AMENITIES_OBJECT,
      },
    },
    rating: {
      type: Number,
      min: [
        HOTEL_VALIDATION_LIMITS.RATING.MIN,
        HOTEL_VALIDATION_MESSAGES.INVALID_RATING,
      ],
      max: [
        HOTEL_VALIDATION_LIMITS.RATING.MAX,
        HOTEL_VALIDATION_MESSAGES.INVALID_RATING,
      ],
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const HotelModel = mongoose.model<IHotelDocument>("Hotel", hotelSchema);
