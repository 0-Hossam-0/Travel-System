import { Schema } from "mongoose";
import { BookingModel } from "./booking.model";
import { ITourBooking } from "../../../schema/booking/tourBooking.schema";
import TOUR_BOOKING_LIMITS from "../../../utils/limit/booking/tourBooking.limit";
import TOUR_BOOKING_MESSAGES from "../../../utils/message/booking/tourBooking.message";

const TourBookingSchema = new Schema<ITourBooking>(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, TOUR_BOOKING_MESSAGES.TOUR_REQUIRED],
    },
    selected_date: {
      type: Date,
      required: [true, TOUR_BOOKING_MESSAGES.DATE_REQUIRED],
    },
    guests: {
      adult: {
        type: Number,
        required: [true, TOUR_BOOKING_MESSAGES.ADULT_MIN],
        min: [TOUR_BOOKING_LIMITS.GUESTS.ADULT_MIN, TOUR_BOOKING_MESSAGES.ADULT_MIN],
      },
      child: {
        type: Number,
        default: 0,
        min: [0, TOUR_BOOKING_MESSAGES.CHILD_MIN],
      },
      infant: {
        type: Number,
        default: 0,
        min: [0, TOUR_BOOKING_MESSAGES.INFANT_MIN],
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



export const TourBookingModel = BookingModel.discriminator(
  "tour",
  TourBookingSchema
);

export default TourBookingModel;