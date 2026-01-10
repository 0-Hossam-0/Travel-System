import { z } from "zod";
import { hotelSchema } from "../../../schema/hotel/hotel.schema";
import mongoose from "mongoose";
import { HOTEL_VALIDATION_MESSAGES } from "../../../utils/message/hotel/hotel.message";

const objectIdSchema = z
  .string({ message: HOTEL_VALIDATION_MESSAGES.ID_REQUIRED })
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: HOTEL_VALIDATION_MESSAGES.INVALID_ID,
  });

export const CreateHotelValidation = z.object({
  body: hotelSchema,
});

export const UpdateHotelByIdValidation = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: hotelSchema.partial(),
});

export const GetHotelByIdValidation = z.object({
  params: z.object({
    hotelId: objectIdSchema,
  }),
});

export const DeleteHotelByIdValidation = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
