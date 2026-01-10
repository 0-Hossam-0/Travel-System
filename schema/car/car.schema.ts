import { z } from "zod";
import { CAR_VALIDATION_LIMITS } from "../../utils/limit/car/car.limit";
import { CAR_VALIDATION_MESSAGES } from "../../utils/message/car/car.message";

export const carSchema = z.object({
  brand: z
    .string({ message: CAR_VALIDATION_MESSAGES.BRAND_REQUIRED })
    .trim()
    .min(CAR_VALIDATION_LIMITS.BRAND.MIN, CAR_VALIDATION_MESSAGES.BRAND_MIN)
    .max(CAR_VALIDATION_LIMITS.BRAND.MAX, CAR_VALIDATION_MESSAGES.BRAND_MAX),

  carModel: z
    .string({ message: CAR_VALIDATION_MESSAGES.MODEL_REQUIRED })
    .trim()
    .min(CAR_VALIDATION_LIMITS.MODEL.MIN, CAR_VALIDATION_MESSAGES.MODEL_MIN)
    .max(CAR_VALIDATION_LIMITS.MODEL.MAX, CAR_VALIDATION_MESSAGES.MODEL_MAX),

  year: z
    .number({ message: CAR_VALIDATION_MESSAGES.YEAR_REQUIRED })
    .min(CAR_VALIDATION_LIMITS.YEAR.MIN, CAR_VALIDATION_MESSAGES.YEAR_MIN)
    .max(CAR_VALIDATION_LIMITS.YEAR.MAX, CAR_VALIDATION_MESSAGES.YEAR_MAX),

  color: z
    .string({ message: CAR_VALIDATION_MESSAGES.COLOR_REQUIRED })
    .trim(),

  price_per_day: z
    .number({ message: CAR_VALIDATION_MESSAGES.PRICE_REQUIRED })
    .min(CAR_VALIDATION_LIMITS.PRICE_PER_DAY.MIN, CAR_VALIDATION_MESSAGES.PRICE_MIN),

  seats: z
    .number({ message: CAR_VALIDATION_MESSAGES.SEATS_REQUIRED })
    .min(CAR_VALIDATION_LIMITS.SEATS.MIN, CAR_VALIDATION_MESSAGES.SEATS_MIN)
    .max(CAR_VALIDATION_LIMITS.SEATS.MAX, CAR_VALIDATION_MESSAGES.SEATS_MAX),
  
  has_ac: z.boolean({ message: CAR_VALIDATION_MESSAGES.AC_REQUIRED }).default(true),

  image: z.string().url().optional(),

  isDeleted: z.boolean().default(false),
});

export type ICar = z.infer<typeof carSchema>;
