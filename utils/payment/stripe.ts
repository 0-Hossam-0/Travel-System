import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

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
    amount: Math.round(amount * 100), // Stripe works in cents
    currency,
    description,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
};
