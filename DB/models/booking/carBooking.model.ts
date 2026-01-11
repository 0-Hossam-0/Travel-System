import { Schema } from "mongoose";
import { BookingModel } from "./booking.model";
import { ICarBooking } from "../../../schema/booking/carBooking.schema";
import CAR_BOOKING_LIMITS from "../../../utils/limit/booking/carBooking.limit";
import CAR_BOOKING_MESSAGES from "../../../utils/message/booking/carBooking.message";

const CarBookingSchema = new Schema<ICarBooking>({
  car: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: [true, CAR_BOOKING_MESSAGES.CAR_REQUIRED],
  },
  pickup_date: {
    type: Date,
    required: [true, CAR_BOOKING_MESSAGES.PICKUP_DATE_REQUIRED],
  },
  dropoff_date: {
    type: Date,
    required: [true, CAR_BOOKING_MESSAGES.DROPOFF_DATE_REQUIRED],
    validate: {
      validator: function (this: any, value: Date): boolean {
        return this.pickup_date ? value > this.pickup_date : true;
      },
      message: CAR_BOOKING_MESSAGES.DATE_ORDER,
    },
  },
  pickup_location: {
    type: String,
    required: [true, CAR_BOOKING_MESSAGES.PICKUP_LOCATION_REQUIRED],
    minlength: [
      CAR_BOOKING_LIMITS.LOCATION.MIN,
      CAR_BOOKING_MESSAGES.LOCATION_SHORT,
    ],
    maxlength: [
      CAR_BOOKING_LIMITS.LOCATION.MAX,
      CAR_BOOKING_MESSAGES.LOCATION_LONG,
    ],
  },
  dropoff_location: {
    type: String,
    required: [true, CAR_BOOKING_MESSAGES.DROPOFF_LOCATION_REQUIRED],
    minlength: [
      CAR_BOOKING_LIMITS.LOCATION.MIN,
      CAR_BOOKING_MESSAGES.LOCATION_SHORT,
    ],
  },
  driver_info: {
    full_name: { type: String, required: true },
    license_number: { type: String, required: true },
    license_expiry: {
      type: Date,
      required: [true, CAR_BOOKING_MESSAGES.LICENSE_EXPIRY_REQUIRED],
    },
    phone: {
      type: String,
      required: [true, CAR_BOOKING_MESSAGES.PHONE_REQUIRED],
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, CAR_BOOKING_MESSAGES.INVALID_EMAIL],
    },
    age: {
      type: Number,
      required: [true, CAR_BOOKING_MESSAGES.AGE_REQUIRED],
      min: [CAR_BOOKING_LIMITS.DRIVER.AGE_MIN, CAR_BOOKING_MESSAGES.AGE_MIN],
    },
  },
  insurance: {
    policy_type: {
      type: String,
      enum: {
        values: ["basic", "premium", "full"],
        message: CAR_BOOKING_MESSAGES.INSURANCE_TYPE_INVALID,
      },
      required: true,
    },
    price: {
      type: Number,
      min: [
        CAR_BOOKING_LIMITS.INSURANCE.PRICE_MIN,
        CAR_BOOKING_MESSAGES.INSURANCE_PRICE_MIN,
      ],
    },
  },
  rental_days: {
    type: Number,
    required: [true, CAR_BOOKING_MESSAGES.RENTAL_DAYS_REQUIRED],
    min: [
      CAR_BOOKING_LIMITS.RENTAL.MIN_DAYS,
      CAR_BOOKING_MESSAGES.RENTAL_DAYS_MIN,
    ],
  },
  daily_rate: {
    type: Number,
    required: [true, CAR_BOOKING_MESSAGES.DAILY_RATE_REQUIRED],
    min: [
      CAR_BOOKING_LIMITS.DAILY_RATE.MIN,
      CAR_BOOKING_MESSAGES.DAILY_RATE_MIN,
    ],
  },
});

export const CarBookingModel = BookingModel.discriminator(
  "car",
  CarBookingSchema
);
export default CarBookingModel;
