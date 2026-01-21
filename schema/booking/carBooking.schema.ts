import z from "zod";
import { baseBookingSchema, objectIdSchema } from "./base.schema";
import { carSchema } from "../car/car.schema";
import CAR_BOOKING_MESSAGES from "../../utils/message/booking/carBooking.message";
import CAR_BOOKING_LIMITS from "../../utils/limit/booking/carBooking.limit";

export const carBookingSchema = baseBookingSchema
  .extend({
    type: z.literal("car"),
    car: objectIdSchema,
    pickup_location: z
      .string({ message: CAR_BOOKING_MESSAGES.PICKUP_LOCATION_REQUIRED })
      .trim()
      .min(CAR_BOOKING_LIMITS.LOCATION.MIN, CAR_BOOKING_MESSAGES.LOCATION_SHORT)
      .max(CAR_BOOKING_LIMITS.LOCATION.MAX, CAR_BOOKING_MESSAGES.LOCATION_LONG),
    dropoff_location: z
      .string({
        message: CAR_BOOKING_MESSAGES.DROPOFF_LOCATION_REQUIRED,
      })
      .trim()
      .min(CAR_BOOKING_LIMITS.LOCATION.MIN, CAR_BOOKING_MESSAGES.LOCATION_SHORT)
      .max(CAR_BOOKING_LIMITS.LOCATION.MAX, CAR_BOOKING_MESSAGES.LOCATION_LONG),
    daily_rate: carSchema.shape.price_per_day,
    rental_days: z
      .number({ message: CAR_BOOKING_MESSAGES.RENTAL_DAYS_REQUIRED })
      .min(
        CAR_BOOKING_LIMITS.RENTAL.MIN_DAYS,
        CAR_BOOKING_MESSAGES.RENTAL_DAYS_MIN
      ),
    pickup_date: z.coerce.date(),
    dropoff_date: z.coerce.date(),
    insurance: z.object({
      policy_type: z.enum(["basic", "premium", "full"]),
      price: z.number().min(CAR_BOOKING_LIMITS.INSURANCE.PRICE_MIN),
    }),
    driver_info: z.object({
      full_name: z
        .string()
        .min(
          CAR_BOOKING_LIMITS.DRIVER.NAME_MIN,
          CAR_BOOKING_MESSAGES.FULL_NAME_SHORT
        ),
      license_number: z
        .string()
        .min(
          CAR_BOOKING_LIMITS.DRIVER.LICENSE_MIN,
          CAR_BOOKING_MESSAGES.LICENSE_SHORT
        ),
      phone: z.string(),
      email: z.string().email(CAR_BOOKING_MESSAGES.INVALID_EMAIL),
    }),
  })
  .refine((data) => data.dropoff_date > data.pickup_date, {
    message: CAR_BOOKING_MESSAGES.DATE_ORDER,
    path: ["dropoff_date"],
  });

export type ICarBooking = z.infer<typeof carBookingSchema>;
