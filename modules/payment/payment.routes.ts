import { Router } from "express";
import { validate } from "../../middleware/validate";
import {
  createPaymentController,
  capturePaymentController,
} from "./payment.controller";
import { stripeWebhookHandler } from "./payment.webhook";
import express from "express";
import { capturePaymentSchema, createPaymentSchema } from "./payment.schema";

const router = Router();

router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

router.post("/", validate(createPaymentSchema), createPaymentController);
router.post(
  "/:paymentId/capture",
  validate(capturePaymentSchema),
  capturePaymentController
);

export default router;
