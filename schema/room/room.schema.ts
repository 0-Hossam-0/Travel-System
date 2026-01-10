import { z } from "zod";
import mongoose from "mongoose";
import { ROOM_VALIDATION_MESSAGES } from "../../utils/message/room/room.message";
import { ROOM_VALIDATION_LIMITS } from "../../utils/limit/room/room.limit";

const objectIdSchema = z
  .string({ message: ROOM_VALIDATION_MESSAGES.ID_REQUIRED })
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: ROOM_VALIDATION_MESSAGES.INVALID_ID,
  })
  .transform((val) => new mongoose.Types.ObjectId(val));

export const roomSchema = z.object({
  hotel_id: objectIdSchema,

  name: z
    .string({ message: ROOM_VALIDATION_MESSAGES.NAME_REQUIRED })
    .trim()
    .min(ROOM_VALIDATION_LIMITS.NAME.MIN, ROOM_VALIDATION_MESSAGES.NAME_MIN),

  occupancy: z
    .number({ message: ROOM_VALIDATION_MESSAGES.OCCUPANCY_REQUIRED })
    .min(
      ROOM_VALIDATION_LIMITS.OCCUPANCY.MIN,
      ROOM_VALIDATION_MESSAGES.OCCUPANCY_MIN
    ),

  price_per_night: z
    .number({ message: ROOM_VALIDATION_MESSAGES.PRICE_REQUIRED })
    .min(ROOM_VALIDATION_LIMITS.PRICE.MIN, ROOM_VALIDATION_MESSAGES.PRICE_MIN),

  refundable: z.boolean().default(true),

  availability_calendar: z
    .array(
      z.object({
        start_date: z.coerce.date({
          message: ROOM_VALIDATION_MESSAGES.DATE_REQUIRED,
        }),
        end_date: z.coerce.date({
          message: ROOM_VALIDATION_MESSAGES.DATE_REQUIRED,
        }),
        status: z
          .enum(["available", "booked", "maintenance"], {
            message: ROOM_VALIDATION_MESSAGES.STATUS_ENUM,
          })
          .default("available"),
      }),
      { message: ROOM_VALIDATION_MESSAGES.CALENDAR_ARRAY }
    )
    .default([]),
  isDeleted: z.boolean().default(false),
});

export type IRoom = z.infer<typeof roomSchema>;
