import { Schema } from "mongoose";
import { BookingModel } from "./booking.model";
import { IFlightBooking } from "../../../schema/booking/flightBooking.schema";
import FLIGHT_BOOKING_MESSAGES from "../../../utils/message/booking/flightBooking.message";
import FLIGHT_BOOKING_LIMITS from "../../../utils/limit/booking/flightBooking.limit";

const FlightBookingSchema = new Schema<IFlightBooking>({
  trip_type: {
    type: String,
    required: [true, FLIGHT_BOOKING_MESSAGES.TRIP_TYPE_REQUIRED],
    enum: {
      values: ["one-way", "round-trip", "multi-city"],
      message: FLIGHT_BOOKING_MESSAGES.TRIP_TYPE_REQUIRED,
    },
  },
  flight_segments: {
    type: [
      {
        flight_id: { type: String, required: true },
        airline: { type: String, required: true },
        flight_number: { type: String, required: true },
        departure_airport: {
          type: String,
          required: true,
          uppercase: true,
          minlength: FLIGHT_BOOKING_LIMITS.AIRPORT_CODE,
          maxlength: FLIGHT_BOOKING_LIMITS.AIRPORT_CODE,
        },
        arrival_airport: {
          type: String,
          required: true,
          uppercase: true,
          minlength: FLIGHT_BOOKING_LIMITS.AIRPORT_CODE,
          maxlength: FLIGHT_BOOKING_LIMITS.AIRPORT_CODE,
        },
        departure_time: { type: Date, required: true },
        arrival_time: { type: Date, required: true },
        cabin_class: {
          type: String,
          required: true,
          enum: {
            values: ["economy", "business", "first"],
            message: FLIGHT_BOOKING_MESSAGES.CABIN_CLASS_INVALID,
          },
        },
      },
    ],
    validate: [
      (val: any) => val.length >= FLIGHT_BOOKING_LIMITS.MIN_PASSENGERS,
      FLIGHT_BOOKING_MESSAGES.SEGMENTS_REQUIRED,
    ],
  },
  passengers: {
    type: [
      {
        title: {
          type: String,
          required: true,
          enum: {
            values: ["Mr", "Mrs", "Ms", "Miss", "Dr"],
            message: FLIGHT_BOOKING_MESSAGES.TITLE_INVALID,
          },
        },
        first_name: {
          type: String,
          required: [true, FLIGHT_BOOKING_MESSAGES.FIRST_NAME_REQUIRED],
          trim: true,
        },
        last_name: {
          type: String,
          required: [true, FLIGHT_BOOKING_MESSAGES.LAST_NAME_REQUIRED],
          trim: true,
        },
        date_of_birth: {
          type: Date,
          required: [true, FLIGHT_BOOKING_MESSAGES.DOB_REQUIRED],
        },
        passport_number: { type: String, trim: true },
        special_requests: { type: String },
        seat_selection: { type: String },
        ticket_number: { type: String },
      },
    ],
    validate: [
      (val: any) => val.length >= FLIGHT_BOOKING_LIMITS.MIN_PASSENGERS,
      FLIGHT_BOOKING_MESSAGES.PASSENGERS_REQUIRED,
    ],
  },
});

const FlightBookingModel = BookingModel.discriminator(
  "flight",
  FlightBookingSchema
);

export default FlightBookingModel;
