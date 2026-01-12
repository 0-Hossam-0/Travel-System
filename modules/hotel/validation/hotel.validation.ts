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

export const GetHotelMapValidation = z.object({
  query: z.object({
    lat: z.coerce
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .optional(),
    lng: z.coerce
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .optional(),
    distance: z.coerce.number().positive().optional(),
    searchTerm: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(50).optional(),
  })
    .refine(
      (data) => {

        if ((data.lat && !data.lng) || (!data.lat && data.lng)) {
          return false;
        }
        return true;
      },

      {
        message: "Both latitude and longitude must be provided together",
      }
    ),
});
