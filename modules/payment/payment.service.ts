import PaymentModel from "./payment.model";
import { PaymentMethod, PaymentStatus } from "./payment.types";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "../../utils/payment/paypal";

interface CreatePaymentParams {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  description?: string;
}

export const createPayment = async ({
  bookingId,
  amount,
  method,
  description,
}: CreatePaymentParams) => {
  if (method !== PaymentMethod.PAYPAL) {
    throw new Error("Only PayPal is supported for now");
  }

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
    approvalUrl: approvalLink.href,
    status: payment.status,
  };
};

export const capturePayment = async (paymentId: string) => {
  const payment = await PaymentModel.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === PaymentStatus.COMPLETED) {
    return payment;
  }

  const paypalResult = await capturePayPalOrder(
    payment.providerPaymentId as string
  );

  if (paypalResult.status !== "COMPLETED") {
    throw new Error("Payment capture failed");
  }

  payment.status = PaymentStatus.COMPLETED;
  payment.paidAt = new Date();

  await payment.save();

  return payment;
};
