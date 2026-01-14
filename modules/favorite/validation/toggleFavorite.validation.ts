import z from "zod";
import { favoriteSchema } from "../../../schema/favorite/favorite.schema";

export const toggleFavoriteValidation = z.object({
  body: favoriteSchema,
});
