import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createFlightBookingValidation = z.object({
  body: z.object({
    tripType: z.enum(["one-way", "round-trip", "multi-city"]),
    flightSegments: z
      .array(
        z.object({
          flightId: z.string().min(1),
          airline: z.string().min(1),
          flightNumber: z.string().min(1),
          departureAirport: z
            .string()
            .length(3, "Airport code must be 3 characters"),
          arrivalAirport: z
            .string()
            .length(3, "Airport code must be 3 characters"),
          departureTime: z.string().datetime(),
          arrivalTime: z.string().datetime(),
          cabinClass: z.enum(["economy", "business", "first"]),
        })
      )
      .min(1, "At least one flight segment is required"),
    passengers: z
      .array(
        z.object({
          title: z.enum(["Mr", "Mrs", "Ms", "Miss", "Dr"]),
          firstName: z.string().min(1, "First name is required"),
          lastName: z.string().min(1, "Last name is required"),
          dateOfBirth: z.string().datetime(),
          passportNumber: z.string().optional(),
          specialRequests: z.string().optional(),
          seatSelection: z.string().optional(),
        })
      )
      .min(1, "At least one passenger is required"),
    totalPrice: z.number().positive(),
  }),
});
