import { z } from "zod";
import { tourBookingSchema } from "./tourBooking.schema";
import { flightBookingSchema } from "./flightBooking.schema";
import { carBookingSchema } from "./carBooking.schema";
import { hotelBookingSchema } from "./hotelBooking.schema";

// Re-export base schemas for convenience
export { objectIdSchema, baseBookingSchema } from "./base.schema";

export const bookingSchema = z.discriminatedUnion("type", [
  tourBookingSchema,
  flightBookingSchema,
  carBookingSchema,
  hotelBookingSchema,
]);

export type IBooking = z.infer<typeof bookingSchema>;
