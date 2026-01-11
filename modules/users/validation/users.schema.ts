import { userSchema } from './../../../schema/user/user.schema';

import z from "zod";

export const updateBasicInfo = z.object({
  body: z.strictObject({
    name: userSchema.shape.name.optional(),
    phone: userSchema.shape.phone.optional(),
    address: userSchema.shape.address.optional(),
  }).refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
});