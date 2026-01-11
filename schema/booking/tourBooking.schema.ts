import z from "zod";
import { baseBookingSchema, objectIdSchema } from "./base.schema";
import TOUR_BOOKING_LIMITS from "../../utils/limit/booking/tourBooking.limit";
import TOUR_BOOKING_MESSAGES from "../../utils/message/booking/tourBooking.message";

export const tourBookingBaseSchema = baseBookingSchema.extend({
  type: z.literal("tour"),
  tour: objectIdSchema.refine((val) => !!val, {
    message: TOUR_BOOKING_MESSAGES.TOUR_REQUIRED,
  }),
  selected_date: z.coerce.date({
    message: TOUR_BOOKING_MESSAGES.DATE_REQUIRED,
  }),
  guests: z.object({
    adult: z
      .number({ message: TOUR_BOOKING_MESSAGES.ADULT_MIN })
      .int()
      .min(
        TOUR_BOOKING_LIMITS.GUESTS.ADULT_MIN,
        TOUR_BOOKING_MESSAGES.ADULT_MIN
      ),
    child: z
      .number()
      .int()
      .min(
        TOUR_BOOKING_LIMITS.GUESTS.CHILD_MIN,
        TOUR_BOOKING_MESSAGES.CHILD_MIN
      )
      .default(0),
    infant: z
      .number()
      .int()
      .min(
        TOUR_BOOKING_LIMITS.GUESTS.INFANT_MIN,
        TOUR_BOOKING_MESSAGES.INFANT_MIN
      )
      .default(0),
  }),
});

export const tourBookingSchema = tourBookingBaseSchema.refine(
  (data) => {
    const total = data.guests.adult + data.guests.child + data.guests.infant;
    return total <= TOUR_BOOKING_LIMITS.GUESTS.TOTAL_MAX;
  },
  {
    message: TOUR_BOOKING_MESSAGES.TOTAL_EXCEEDED,
    path: ["guests"],
  }
);

export type ITourBooking = z.infer<typeof tourBookingSchema>;
