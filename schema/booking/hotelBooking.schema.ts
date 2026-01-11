import z from "zod";
import { baseBookingSchema, objectIdSchema } from "./base.schema";
import { roomSchema } from "../room/room.schema";

export const hotelBookingSchema = baseBookingSchema.extend({
  type: z.literal("hotel"),
  hotel: objectIdSchema,
  check_in_date: z.coerce.date(),
  check_out_date: z.coerce.date(),
  rooms: z
    .array(
      z.object({
        room_id: objectIdSchema,
        quantity: z.number().int().min(1),
        price_per_night: roomSchema.shape.price_per_night,
      })
    )
    .min(1, "At least one room must be booked"),
  guests: z.object({
    adults: z.number().int().min(1),
    children: z.number().int().min(0).default(0),
  }),
});

export type IHotelBooking = z.infer<typeof hotelBookingSchema>;
