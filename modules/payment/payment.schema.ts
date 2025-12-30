import Joi from "joi";
import { PaymentMethod } from "./payment.types";

export const createPaymentSchema = {
  body: Joi.object({
    bookingId: Joi.string().required(),

    amount: Joi.number().positive().required(),

    currency: Joi.string().length(3).uppercase().default("USD"),

    method: Joi.string()
      .valid(PaymentMethod.PAYPAL, PaymentMethod.CARD)
      .required(),

    description: Joi.string().optional(),
  }),
};

export const capturePaymentSchema = {
  params: Joi.object({
    paymentId: Joi.string().required(),
  }),
};
