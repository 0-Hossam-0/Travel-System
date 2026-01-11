import { z } from "zod";
import REGEX_PATTERNS from "../../../utils/regex/regex";

const objectIdSchema = z
  .string({message: ""})
  .regex(REGEX_PATTERNS.MONGO_ID, "Invalid ID format");

export const createCarBookingValidation = z.object({
  body: z.object({
    carId: objectIdSchema,
    pickupDate: z.string().datetime(),
    dropOffDate: z.string().datetime(),
    pickupLocation: z.string().min(2),
    dropoffLocation: z.string().min(2),
    driverInfo: z.object({
      fullName: z.string().min(2),
      licenseNumber: z.string().min(5),
      licenseExpiry: z.string().datetime(),
      phone: z.string().min(10),
      email: z.string().email(),
      age: z.number().int().min(18, "Driver must be at least 18 years old"),
    }),
    insurance: z.object({
      type: z.enum(["basic", "premium", "full"]),
      price: z.number().positive(),
    }),
    extras: z
      .array(
        z.object({
          name: z.string(),
          price: z.number().positive(),
          quantity: z.number().int().positive().optional(),
        })
      )
      .optional()
      .default([]),
  }),
});
