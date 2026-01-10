import { z } from "zod";
import { CATEGORY_LIMITS } from "../../validation/category/category.config";
import REGEX_PATTERNS from "../../validation/regex.config";
import VALIDATION_MESSAGES from "../../validation/message.validation";

export const categorySchema = z.object({
  key: z
    .string({ message: VALIDATION_MESSAGES.REQUIRED("Key") })
    .trim()
    .toLowerCase()
    .min(
      CATEGORY_LIMITS.CATEGORY.KEY_MIN,
      VALIDATION_MESSAGES.MIN_LENGTH("Key", CATEGORY_LIMITS.CATEGORY.KEY_MIN)
    )
    .max(
      CATEGORY_LIMITS.CATEGORY.KEY_MAX,
      VALIDATION_MESSAGES.MAX_LENGTH("Key", CATEGORY_LIMITS.CATEGORY.KEY_MAX)
    )
    .regex(REGEX_PATTERNS.SLUG, VALIDATION_MESSAGES.SLUG_ERROR),

  title: z
    .string({ message: VALIDATION_MESSAGES.REQUIRED("Title") })
    .trim()
    .min(
      CATEGORY_LIMITS.CATEGORY.TITLE_MIN,
      VALIDATION_MESSAGES.MIN_LENGTH(
        "Title",
        CATEGORY_LIMITS.CATEGORY.TITLE_MIN
      )
    ),

  description: z
    .string({ message: VALIDATION_MESSAGES.REQUIRED("Description") })
    .min(
      CATEGORY_LIMITS.CATEGORY.DESC_MIN,
      VALIDATION_MESSAGES.MIN_LENGTH(
        "Description",
        CATEGORY_LIMITS.CATEGORY.DESC_MIN
      )
    ),

  image: z
    .string({ message: VALIDATION_MESSAGES.REQUIRED("Image URL") })
    .url(VALIDATION_MESSAGES.INVALID_FORMAT("Image URL")),

  editable_fields: z
    .array(z.string())
    .default(["title", "description", "image"]),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ICategory = z.infer<typeof categorySchema>;
