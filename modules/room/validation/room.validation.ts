import { z } from "zod";
import { roomSchema } from "../../../schema/room/room.schema";
import mongoose from "mongoose";
import { ROOM_VALIDATION_MESSAGES } from "../../../utils/message/room/room.message";

const objectIdSchema = z
  .string({ message: ROOM_VALIDATION_MESSAGES.ID_REQUIRED })
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: ROOM_VALIDATION_MESSAGES.INVALID_ID,
  });

export const CreateRoomValidation = z.object({
  body: roomSchema,
});

export const UpdateRoomByIdValidation = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: roomSchema.partial(),
});

export const GetRoomByHotelIdValidation = z.object({
  params: z.object({
    hotelId: objectIdSchema,
  }),
});

export const DeleteRoomByIdValidation = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const GetRoomByIdValidation = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
