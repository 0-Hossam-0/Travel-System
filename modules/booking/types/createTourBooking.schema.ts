import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createTourBookingValidation = z.object({
  body: z.object({
    tourId: objectIdSchema,
    selectedDate: z.string().datetime(),
    guests: z.object({
      adult: z.number().int().min(1),
      child: z.number().int().min(0).default(0),
      infant: z.number().int().min(0).default(0),
    }),
  }),
});