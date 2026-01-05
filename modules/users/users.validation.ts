import z from "zod";
import { GeneralFields } from "../../middleware/requestValidation/generalFields.validation";

export const UpdateProfileInfoSchema = z.object({
  body: z
    .strictObject({
      name: z.string().regex(GeneralFields.USERNAME_REGEX).optional(),
      address: z.string().min(10).max(200).optional(),
      phone: z.string().regex(GeneralFields.PHONE_NUMBER).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
});