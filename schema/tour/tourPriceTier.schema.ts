import { z } from "zod";
import { Types } from "mongoose";

const objectIdSchema = z.custom<Types.ObjectId>(
  (val) => Types.ObjectId.isValid(val as string | Types.ObjectId),
  { message: "Invalid Mongoose ObjectId" }
);

export const tourPriceTierSchema = z.object({
  tour_id: objectIdSchema,
  name: z
    .string({ message: "Price tier name is required" })
    .trim()
    .min(1, "Name cannot be empty"),
  adult_price: z
    .number({ message: "Adult price is required" })
    .min(0, "Price must be 0 or greater"),
  child_price: z.number().min(0, "Price must be 0 or greater").default(0),
  infant_price: z.number().min(0, "Price must be 0 or greater").default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ITourPriceTier = z.infer<typeof tourPriceTierSchema>;
