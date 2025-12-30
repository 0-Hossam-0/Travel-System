import PaymentModel from "./payment.model";
import { PaymentMethod, PaymentStatus } from "./payment.types";
import { createStripePaymentIntent } from "../../utils/payment/stripe";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "../../utils/payment/paypal";
import { paymentEventEmitter } from "./payment.events";

interface CreatePaymentParams {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  description?: string;
}

// =========================
// Create Payment (PayPal / Card)
// =========================
export const createPayment = async ({
  bookingId,
  amount,
  method,
  description,
}: CreatePaymentParams) => {
  // =========================
  // PayPal Payment
  // =========================
  if (method === PaymentMethod.PAYPAL) {
    const paypalOrder = await createPayPalOrder({
      amount,
      description,
    });
    const approvalLink = paypalOrder.links.find(
      (link: any) => link.rel === "approve"
    );
    if (!approvalLink) {
      throw new Error("PayPal approval link not found");
    }
    const payment = await PaymentModel.create({
      bookingId,
      amount,
      method,
      status: PaymentStatus.PENDING,
      providerPaymentId: paypalOrder.id,
      approvalUrl: approvalLink.href,
    });
    return {
      paymentId: payment._id,
      status: payment.status,
      approvalUrl: approvalLink.href,
    };
  }

  // =========================
  // Card Payment (Visa / Mastercard via Stripe)
  // =========================
  if (method === PaymentMethod.CARD) {
    const intent = await createStripePaymentIntent({
      amount,
      currency: "USD",
      description,
    });

    const payment = await PaymentModel.create({
      bookingId,
      amount,
      method,
      status: PaymentStatus.PENDING,
      providerPaymentId: intent.id,
    });

    return {
      paymentId: payment._id,
      status: payment.status,
      clientSecret: intent.client_secret,
    };
  }

  throw new Error("Unsupported payment method");
};

// =========================
// Capture PayPal Payment
// =========================
export const capturePayment = async (paymentId: string) => {
  const payment = await PaymentModel.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Prevent double capture
  if (payment.status === PaymentStatus.COMPLETED) {
    return payment;
  }

  // Capture only applies to PayPal
  if (payment.method !== PaymentMethod.PAYPAL) {
    throw new Error("Capture is only supported for PayPal payments");
  }

  const paypalResult = await capturePayPalOrder(
    payment.providerPaymentId as string
  );

  // =========================
  // Capture Failed
  // =========================
  if (paypalResult.status !== "COMPLETED") {
    payment.status = PaymentStatus.FAILED;
    await payment.save();

    // Emit FAILED event
    await paymentEventEmitter.emit({
      paymentId: payment._id.toString(),
      bookingId: payment.bookingId.toString(),
      status: "FAILED",
      method: payment.method,
      amount: payment.amount,
    });

    throw new Error("Payment capture failed");
  }

  // =========================
  // Capture Success
  // =========================
  payment.status = PaymentStatus.COMPLETED;
  payment.paidAt = new Date();
  await payment.save();

  // Emit COMPLETED event
  await paymentEventEmitter.emit({
    paymentId: payment._id.toString(),
    bookingId: payment.bookingId.toString(),
    status: "COMPLETED",
    method: payment.method,
    amount: payment.amount,
  });

  return payment;
};
