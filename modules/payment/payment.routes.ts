import { Router } from "express";
import { validateRequest } from "../../middleware/requestValidation.middleware";
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

router.post("/", validateRequest(createPaymentSchema), createPaymentController);
router.post(
  "/:paymentId/capture",
  validateRequest(capturePaymentSchema),
  capturePaymentController
);

export default router;
