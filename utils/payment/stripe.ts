import Stripe from "stripe";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing from environment variables");
}

const stripe = new Stripe(STRIPE_KEY);

interface CreateStripePaymentIntentParams {
  amount: number;
  currency: string;
  description?: string;
}

export const createStripePaymentIntent = async ({
  amount,
  currency,
  description,
}: CreateStripePaymentIntentParams) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    description,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
};
