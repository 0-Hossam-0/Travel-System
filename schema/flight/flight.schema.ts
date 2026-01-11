import { z } from "zod";
import { Types } from "mongoose";
import REGEX_PATTERNS from "../../utils/regex/regex";
import FLIGHT_VALIDATION_MESSAGES from "../../utils/message/flight/flight.message";
import FLIGHT_VALIDATION_LIMITS from "../../utils/limit/flight/fight.limit";

const objectIdSchema = z
  .string({ message: FLIGHT_VALIDATION_MESSAGES.ID_REQUIRED })
  .regex(REGEX_PATTERNS.MONGO_ID, FLIGHT_VALIDATION_MESSAGES.INVALID_ID)
  .transform((val) => new Types.ObjectId(val));

export const flightSchema = z
  .object({
    flight_number: z
      .string({
        message: FLIGHT_VALIDATION_MESSAGES.FLIGHT_NUMBER_REQUIRED,
      })
      .trim()
      .toUpperCase()
      .min(
        FLIGHT_VALIDATION_LIMITS.FLIGHT_NUMBER.MIN,
        FLIGHT_VALIDATION_MESSAGES.FLIGHT_NUMBER_MIN
      )
      .max(
        FLIGHT_VALIDATION_LIMITS.FLIGHT_NUMBER.MAX,
        FLIGHT_VALIDATION_MESSAGES.FLIGHT_NUMBER_MAX
      ),

    carrier_id: objectIdSchema,
    origin_airport_id: objectIdSchema,
    dest_airport_id: objectIdSchema,

    departure_at: z.coerce.date({
      message: FLIGHT_VALIDATION_MESSAGES.DEPARTURE_REQUIRED,
    }),

    arrival_at: z.coerce.date({
      message: FLIGHT_VALIDATION_MESSAGES.ARRIVAL_REQUIRED,
    }),

    duration: z
      .number({ message: FLIGHT_VALIDATION_MESSAGES.DURATION_REQUIRED })
      .min(
        FLIGHT_VALIDATION_LIMITS.DURATION.MIN,
        FLIGHT_VALIDATION_MESSAGES.DURATION_MIN
      ),

    status: z
      .enum(["scheduled", "delayed", "departed", "arrived", "cancelled"], {
        message: FLIGHT_VALIDATION_MESSAGES.STATUS_ENUM,
      })
      .default("scheduled"),
  })
  .refine((data) => data.arrival_at > data.departure_at, {
    message: FLIGHT_VALIDATION_MESSAGES.DATE_ORDER_INVALID,
    path: ["arrival_at"],
  });

export type IFlight = z.infer<typeof flightSchema>;