export enum PaymentMethod {
  PAYPAL = "PAYPAL",
  CARD = "CARD", // Visa / Mastercard
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentProvider {
  PAYPAL = "PAYPAL",
  STRIPE = "STRIPE",
}

export interface CreatePaymentInput {
  bookingId: string;
  amount: number;
  currency: string; // e.g. USD
  method: PaymentMethod;
  description?: string;
}

export interface PaymentResult {
  paymentId: string;
  status: PaymentStatus;
  approvalUrl?: string; // PayPal
  clientSecret?: string; // Stripe
}
