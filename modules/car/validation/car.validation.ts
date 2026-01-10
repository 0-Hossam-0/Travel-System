import { z } from "zod";
import { carSchema } from "../../../schema/car/car.schema";
import mongoose from "mongoose";
import { CAR_VALIDATION_MESSAGES } from "../../../utils/message/car/car.message";

const objectIdSchema = z
  .string({ message: CAR_VALIDATION_MESSAGES.ID_REQUIRED })
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: CAR_VALIDATION_MESSAGES.INVALID_ID,
  });

export const CreateCarValidation = z.object({
  body: carSchema,
});

export const UpdateCarByIdValidation = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: carSchema.partial(),
});

export const GetCarByIdValidation = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const DeleteCarByIdValidation = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
