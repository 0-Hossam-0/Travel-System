import { Schema } from "mongoose";
import BOOKING_VALIDATION_LIMITS from "../../../utils/limit/booking/booking.limit";
import BOOKING_VALIDATION_MESSAGES from "../../../utils/message/booking/booking.message";
import { BookingModel } from "./booking.model";
import IHotelBooking from "../../../schema/booking/hotelBooking.schema";

const HotelBookingSchema = new Schema<IHotelBooking>({
  hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
  rooms: [
    {
      room_id: { type: Schema.Types.ObjectId, ref: "Room", required: true },
      quantity: { type: Number, required: true, min: 1 },
      price_per_night: { type: Number, required: true },
    },
  ],
  check_in_date: { type: Date, required: true },
  check_out_date: { type: Date, required: true },
  nights: { type: Number, required: true },
  guests: {
    adults: {
      type: Number,
      required: true,
      min: [
        BOOKING_VALIDATION_LIMITS.GUESTS.ADULT_MIN,
        BOOKING_VALIDATION_MESSAGES.ADULT_REQUIRED,
      ],
    },
    children: { type: Number, default: 0 },
  },
  rate_plan: {
    name: { type: String, required: true },
    cancellation_policy: { type: String, required: true },
    breakfast_included: { type: Boolean, default: false },
  },
});

export const HotelBookingModel = BookingModel.discriminator(
  "hotel",
  HotelBookingSchema
);

export default HotelBookingModel;
