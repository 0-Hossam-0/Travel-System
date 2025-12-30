import { Request, Response } from "express";
import Stripe from "stripe";
import PaymentModel from "./payment.model";
import { PaymentStatus } from "./payment.types";
import { paymentEventEmitter } from "./payment.events";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;

    const payment = await PaymentModel.findOneAndUpdate(
      { providerPaymentId: intent.id },
      {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
      { new: true }
    );

    if (payment) {
      await paymentEventEmitter.emit({
        paymentId: payment._id.toString(),
        bookingId: payment.bookingId.toString(),
        status: "COMPLETED",
        method: payment.method,
        amount: payment.amount,
      });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;

    const payment = await PaymentModel.findOneAndUpdate(
      { providerPaymentId: intent.id },
      { status: PaymentStatus.FAILED },
      { new: true }
    );

    if (payment) {
      await paymentEventEmitter.emit({
        paymentId: payment._id.toString(),
        bookingId: payment.bookingId.toString(),
        status: "FAILED",
        method: payment.method,
        amount: payment.amount,
      });
    }
  }

  res.json({ received: true });
};
