import { z } from "zod";
import { Types } from "mongoose";

const objectIdSchema = z.custom<Types.ObjectId>(
  (val) => Types.ObjectId.isValid(val as string | Types.ObjectId),
  { message: "Invalid Mongoose ObjectId" }
);

export const tourImageSchema = z.object({
  tour_id: objectIdSchema,
  url: z
    .string({ message: "Image URL is required" })
    .url("Must be a valid URL format"),
  caption: z.string().trim().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ITourImage = z.infer<typeof tourImageSchema>;
