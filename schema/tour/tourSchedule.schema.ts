import { z } from "zod";
import VALIDATION_MESSAGES from "../../validation/message.validation";
import TOUR_SCHEDULE_VALIDATION_MESSAGES from "../../validation/tour/tourSchedule.validation";
import REGEX_PATTERNS from "../../validation/regex.config";
import { Types } from "mongoose";

const objectIdSchema = (fieldName: string) =>
  z
    .string({ message: VALIDATION_MESSAGES.REQUIRED(fieldName) })
    .regex(REGEX_PATTERNS.MONGO_ID, VALIDATION_MESSAGES.INVALID_ID)
    .transform((val) => new Types.ObjectId(val));

export const tourScheduleSchema = z
  .object({
    tour_id: objectIdSchema("Tour ID"),

    price_tier_id: objectIdSchema("Price Tier ID"),

    start_date: z.coerce.date({
      message: TOUR_SCHEDULE_VALIDATION_MESSAGES.START_DATE_REQUIRED,
    }),

    end_date: z.coerce.date({
      message: TOUR_SCHEDULE_VALIDATION_MESSAGES.END_DATE_REQUIRED,
    }),

    capacity: z
      .number({
        message: TOUR_SCHEDULE_VALIDATION_MESSAGES.CAPACITY_REQUIRED,
      })
      .int()
      .min(1, TOUR_SCHEDULE_VALIDATION_MESSAGES.MIN_CAPACITY),

    available_slots: z
      .number({
        message: TOUR_SCHEDULE_VALIDATION_MESSAGES.AVAILABLE_SLOTS_REQUIRED,
      })
      .int()
      .min(0, TOUR_SCHEDULE_VALIDATION_MESSAGES.MIN_SLOTS),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: TOUR_SCHEDULE_VALIDATION_MESSAGES.DATE_ORDER_ERROR,
    path: ["end_date"],
  });

export type ITourSchedule = z.infer<typeof tourScheduleSchema>;
