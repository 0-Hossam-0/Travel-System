import { z } from "zod";
import FAVORITE_VALIDATION_MESSAGE from "../../utils/message/favorite/favorite.message";
import FAVORITE_LIMITS from "../../utils/limit/favorite/favorite.limit";
import REGEX_PATTERNS from "../../utils/regex/regex";
import { Types } from "mongoose";

const objectIdSchema = z
  .string()
  .regex(REGEX_PATTERNS.MONGO_ID, FAVORITE_VALIDATION_MESSAGE.INVALID_ID)
  .transform((val) => new Types.ObjectId(val));

export const favoriteSchema = z.object({
  user_id: objectIdSchema.optional(),

  category: z.enum(FAVORITE_LIMITS.CATEGORY, {
    message: FAVORITE_VALIDATION_MESSAGE.CATEGORY_INVALID,
  }),

  item_id: objectIdSchema.refine((val) => !!val, {
    message: FAVORITE_VALIDATION_MESSAGE.ITEM_REQUIRED,
  }),

  added_at: z.coerce.date().optional(),
});

export type IFavorite = z.infer<typeof favoriteSchema>;
