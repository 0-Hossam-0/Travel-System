import { Router } from "express";
import {
  createPaymentController,
  capturePaymentController,
} from "./payment.controller";

const router = Router();

router.post("/", createPaymentController);
router.post("/:paymentId/capture", capturePaymentController);

export default router;
