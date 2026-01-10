import { z } from "zod";
import { tourSchema } from "../../../schema/tour/tour.schema";

const baseFields = tourSchema.pick({
  title: true,
  description: true,
  main_image: true,
  location: true,
  duration: true,
  recommended: true,
});

export const createTourSchema = z.object({
  body: baseFields.extend({
    price_tiers: z
      .array(
        z.object({
          name: z.string().min(1, "Tier name is required"),
          adult_price: z.number().min(0),
          child_price: z.number().min(0).default(0),
          infant_price: z.number().min(0).default(0),
        })
      )
      .min(1, "At least one price tier is required"),
    gallery: z
      .array(
        z.object({
          url: z.string().url(),
          caption: z.string().optional(),
        })
      )
      .optional(),
    schedules: z
      .array(
        z.object({
          tier_name: z.string(),
          start_date: z.coerce.date(),
          end_date: z.coerce.date(),
          capacity: z.number().int().min(1),
        })
      )
      .optional(),
  }),
});

export type ICreateTourSchema = z.infer<typeof createTourSchema>["body"];
