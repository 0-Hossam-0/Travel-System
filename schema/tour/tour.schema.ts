import { z } from "zod";
import { Types } from "mongoose";
import REGEX_PATTERNS from "../../utils/regex/regex";
import TOUR_VALIDATION_MESSAGES from "../../utils/message/tour/tour.message";
import TOUR_VALIDATION_LIMITS from "../../utils/limit/tour/tour.limit";

const objectIdSchema = z
  .string({ message: TOUR_VALIDATION_MESSAGES.ID_REQUIRED })
  .regex(REGEX_PATTERNS.MONGO_ID, TOUR_VALIDATION_MESSAGES.ID_INVALID)
  .transform((val) => new Types.ObjectId(val));

export const tourSchema = z.object({
  title: z
    .string({ message: TOUR_VALIDATION_MESSAGES.TITLE_REQUIRED })
    .trim()
    .min(TOUR_VALIDATION_LIMITS.TITLE.MIN, TOUR_VALIDATION_MESSAGES.TITLE_MIN)
    .max(TOUR_VALIDATION_LIMITS.TITLE.MAX, TOUR_VALIDATION_MESSAGES.TITLE_MAX),

  slug: z
    .string({ message: TOUR_VALIDATION_MESSAGES.SLUG_REQUIRED })
    .trim()
    .regex(REGEX_PATTERNS.SLUG, TOUR_VALIDATION_MESSAGES.SLUG_INVALID),

  main_image: z
    .string({ message: TOUR_VALIDATION_MESSAGES.MAIN_IMAGE_REQUIRED })
    .url(TOUR_VALIDATION_MESSAGES.INVALID_IMAGE_URL),

  description: z
    .string({ message: TOUR_VALIDATION_MESSAGES.DESC_REQUIRED })
    .min(
      TOUR_VALIDATION_LIMITS.DESCRIPTION.MIN,
      TOUR_VALIDATION_MESSAGES.DESC_MIN
    )
    .max(
      TOUR_VALIDATION_LIMITS.DESCRIPTION.MAX,
      TOUR_VALIDATION_MESSAGES.DESC_MAX
    ),

  duration: z
    .number({
      message: TOUR_VALIDATION_MESSAGES.DURATION_REQUIRED,
    })
    .int("Duration must be an integer")
    .positive(TOUR_VALIDATION_MESSAGES.DURATION_POSITIVE)
    .min(
      TOUR_VALIDATION_LIMITS.DURATION.MIN_MS,
      TOUR_VALIDATION_MESSAGES.DURATION_MIN
    ),

  location: z
    .string({ message: TOUR_VALIDATION_MESSAGES.LOCATION_REQUIRED })
    .trim(),

  recommended: z.boolean().default(false),

  created_by: objectIdSchema,

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ITour = z.infer<typeof tourSchema>;
