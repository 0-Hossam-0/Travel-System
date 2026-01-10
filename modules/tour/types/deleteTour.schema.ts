import { z } from "zod";
import REGEX_PATTERNS from "../../../utils/regex/regex";
import TOUR_VALIDATION_MESSAGES from "../../../utils/message/tour/tour.message";

export const deleteTourSchema = z.object({
  params: z.object({
    id: z
      .string({
        message: TOUR_VALIDATION_MESSAGES.ID_REQUIRED,
      })
      .regex(REGEX_PATTERNS.MONGO_ID, TOUR_VALIDATION_MESSAGES.ID_INVALID),
  }),
});

export type IDeleteTourRequest = z.infer<typeof deleteTourSchema>;
