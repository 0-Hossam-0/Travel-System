import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createHotelBookingValidation = z.object({
  body: z.object({
    hotelId: objectIdSchema,
    rooms: z
      .array(
        z.object({
          roomId: objectIdSchema,
          quantity: z.number().int().min(1),
          pricePerNight: z.number().positive(),
        })
      )
      .min(1, "At least one room must be selected"),
    checkInDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
    checkOutDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
    guests: z.object({
      adults: z.number().int().min(1),
      children: z.number().int().min(0).default(0),
    }),
    ratePlan: z.object({
      name: z.string().min(2),
      cancellationPolicy: z.string().min(10),
      breakfastIncluded: z.boolean().default(false),
    }),
    guestInfo: z.object({
      fullName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(10),
      specialRequests: z.string().optional(),
    }),
    extras: z
      .array(
        z.object({
          name: z.string(),
          price: z.number().positive(),
        })
      )
      .optional()
      .default([]),
  }),
});
