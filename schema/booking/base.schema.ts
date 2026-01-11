import { z } from "zod";
import { Types } from "mongoose";
import REGEX_PATTERNS from "../../utils/regex/regex";

export const objectIdSchema = z
  .string({ message: "ID is required" })
  .regex(REGEX_PATTERNS.MONGO_ID, "Invalid ID format")
  .transform((val) => new Types.ObjectId(val));

export const baseBookingSchema = z.object({
  user: objectIdSchema,
  total_price: z.number().positive("Total price must be positive"),
  status: z
    .enum(["pending", "confirmed", "cancelled", "failed"])
    .default("pending"),
  payment_status: z
    .enum(["pending", "paid", "refunded", "failed"])
    .default("pending"),
  payment_id: z.string().optional(),
  booking_reference: z.string().min(1, "Booking reference is required"),
});
