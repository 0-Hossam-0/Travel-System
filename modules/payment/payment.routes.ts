import { Router } from "express";
import {
  createPaymentController,
  capturePaymentController,
} from "./payment.controller";
import { stripeWebhookHandler } from "./payment.webhook";
import express from "express";

const router = Router();

router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

router.post("/", createPaymentController);
router.post("/:paymentId/capture", capturePaymentController);

export default router;
