import { z } from "zod";
import { createTourSchema } from "./createTour.schema";

export const updateTourSchema = z.object({
  body: createTourSchema.shape.body.partial(),
});

export type IUpdateTourSchema = z.infer<typeof updateTourSchema>["body"];
