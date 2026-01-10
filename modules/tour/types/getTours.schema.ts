import { z } from "zod";
import { tourSchema } from "../../../schema/tour/tour.schema";
import { Request } from "express";

const baseTourFilters = tourSchema
  .pick({
    location: true,
  })
  .partial();

export const getToursQuerySchema = baseTourFilters.extend({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: "Page must be positive" }),

  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),

  recommended: z
    .string()
    .optional()
    .transform((val) => {
      if (val === "true" || val === "1") return true;
      if (val === "false" || val === "0") return false;
      return undefined;
    }),

  minDuration: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),

  maxDuration: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),

  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),

  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),

  search: z.string().trim().optional(),

  sortBy: z
    .enum([
      "createdAt",
      "title",
      "duration",
      "location",
      "recommended",
      "updatedAt",
    ])
    .optional()
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type IGetToursQuery = z.infer<typeof getToursQuerySchema>;

export const getToursRequestSchema = z.object({
  query: getToursQuerySchema,
});

export type IGetToursRequest = z.infer<typeof getToursRequestSchema> & Request;
