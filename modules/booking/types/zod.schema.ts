import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createTourBookingZodSchema = z.object({
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

export const createCarBookingZodSchema = z.object({
  body: z.object({
    carId: objectIdSchema,
    pickupDate: z.string().datetime(),
    dropOffDate: z.string().datetime(),
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

export const createFlightBookingZodSchema = z.object({
  body: z
    .object({
      flightId: objectIdSchema,
      selectedSeats: z.array(z.string()).min(1),
      cabinClass: z.enum(["economy", "business", "first"]),
      passengers: z
        .array(
          z.object({
            title: z.enum(["Mr", "Mrs", "Ms", "Miss", "Dr"]),
            firstName: z.string().min(2),
            lastName: z.string().min(2),
            dateOfBirth: z.string().datetime(),
            passportNumber: z.string().optional(),
            specialRequests: z.string().optional(),
          })
        )
        .min(1),
    })
    .refine((data) => data.selectedSeats.length === data.passengers.length, {
      message: "Number of seats must match number of passengers",
      path: ["selectedSeats"],
    }),
});

export const createHotelBookingZodSchema = z.object({
  body: z.object({
    hotelId: objectIdSchema,
    roomId: objectIdSchema,
    checkInDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
    checkOutDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
    guests: z.object({
      adults: z.number().int().min(1),
      children: z.number().int().min(0),
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
