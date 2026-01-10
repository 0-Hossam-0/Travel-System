import { z } from "zod";
import { HOTEL_VALIDATION_LIMITS } from "../../utils/limit/hotel/hotel.limit";
import { HOTEL_VALIDATION_MESSAGES } from "../../utils/message/hotel/hotel.message";

export const hotelSchema = z.object({
  name: z
    .string({ message: HOTEL_VALIDATION_MESSAGES.NAME_REQUIRED })
    .trim()
    .min(HOTEL_VALIDATION_LIMITS.NAME.MIN, HOTEL_VALIDATION_MESSAGES.NAME_MIN)
    .max(HOTEL_VALIDATION_LIMITS.NAME.MAX, HOTEL_VALIDATION_MESSAGES.NAME_MAX),

  location: z
    .string({ message: HOTEL_VALIDATION_MESSAGES.LOCATION_REQUIRED })
    .trim(),

  address: z
    .string({ message: HOTEL_VALIDATION_MESSAGES.ADDRESS_REQUIRED })
    .trim()
    .min(
      HOTEL_VALIDATION_LIMITS.ADDRESS.MIN,
      HOTEL_VALIDATION_MESSAGES.ADDRESS_MIN
    )
    .max(
      HOTEL_VALIDATION_LIMITS.ADDRESS.MAX,
      HOTEL_VALIDATION_MESSAGES.ADDRESS_MAX
    ),

  main_image: z
    .string({ message: HOTEL_VALIDATION_MESSAGES.IMAGE_REQUIRED })
    .url(HOTEL_VALIDATION_MESSAGES.INVALID_IMAGE_URL),

  amenities_json: z
    .record(z.string(), z.any(), {
      error: HOTEL_VALIDATION_MESSAGES.AMENITIES_OBJECT,
    })
    .default({}),

  rating: z
    .number({ message: "Rating must be a number" })
    .min(
      HOTEL_VALIDATION_LIMITS.RATING.MIN,
      HOTEL_VALIDATION_MESSAGES.INVALID_RATING
    )
    .max(
      HOTEL_VALIDATION_LIMITS.RATING.MAX,
      HOTEL_VALIDATION_MESSAGES.INVALID_RATING
    )
    .default(0),
  isDeleted: z.boolean().default(false),
});

export type IHotel = z.infer<typeof hotelSchema>;
