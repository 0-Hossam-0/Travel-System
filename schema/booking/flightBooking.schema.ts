import z from "zod";
import { flightSchema } from "../flight/flight.schema";
import { baseBookingSchema, objectIdSchema } from "./base.schema";
import FLIGHT_BOOKING_MESSAGES from "../../utils/message/booking/flightBooking.message";
import FLIGHT_BOOKING_LIMITS from "../../utils/limit/booking/flightBooking.limit";

export const flightBookingSchema = baseBookingSchema.extend({
  type: z.literal("flight"),
  trip_type: z.enum(["one-way", "round-trip", "multi-city"], {
    message: FLIGHT_BOOKING_MESSAGES.TRIP_TYPE_REQUIRED,
  }),

  flight_segments: z
    .array(
      z.object({
        flight_id: objectIdSchema,

        carrier_id: flightSchema.shape.carrier_id,
        origin_airport_id: flightSchema.shape.origin_airport_id,
        dest_airport_id: flightSchema.shape.dest_airport_id,

        departure_time: flightSchema.shape.departure_at,
        arrival_time: flightSchema.shape.arrival_at,

        cabin_class: z
          .enum(["economy", "premium_economy", "business", "first"], {
            message: FLIGHT_BOOKING_MESSAGES.CABIN_CLASS_INVALID,
          })
          .default("economy"),
        seat_number: z.string().optional(),
      })
    )
    .min(
      FLIGHT_BOOKING_LIMITS.MIN_PASSENGERS,
      FLIGHT_BOOKING_MESSAGES.SEGMENTS_REQUIRED
    ),

  passengers: z
    .array(
      z.object({
        first_name: z
          .string({
            message: FLIGHT_BOOKING_MESSAGES.FIRST_NAME_REQUIRED,
          })
          .trim()
          .min(
            FLIGHT_BOOKING_LIMITS.PASSENGER.NAME_MIN,
            FLIGHT_BOOKING_MESSAGES.FIRST_NAME_REQUIRED
          ),
        last_name: z
          .string({
            message: FLIGHT_BOOKING_MESSAGES.LAST_NAME_REQUIRED,
          })
          .trim()
          .min(
            FLIGHT_BOOKING_LIMITS.PASSENGER.NAME_MIN,
            FLIGHT_BOOKING_MESSAGES.LAST_NAME_REQUIRED
          ),
        date_of_birth: z.coerce.date({
          message: FLIGHT_BOOKING_MESSAGES.DOB_REQUIRED,
        }),
        passport_number: z
          .string()
          .min(5, "Passport number is required")
          .optional(),
        nationality: z.string().optional(),
      })
    )
    .min(
      FLIGHT_BOOKING_LIMITS.MIN_PASSENGERS,
      FLIGHT_BOOKING_MESSAGES.PASSENGERS_REQUIRED
    ),
});

export type IFlightBooking = z.infer<typeof flightBookingSchema>;
