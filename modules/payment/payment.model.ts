import mongoose, { Schema, Types } from "mongoose";
import { PaymentMethod, PaymentStatus } from "./payment.types";

const paymentSchema = new Schema(
  {
    bookingId: {
      type: Types.ObjectId,
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "USD",
    },

    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    providerPaymentId: {
      type: String, // PayPal order id
    },

    approvalUrl: {
      type: String, // PayPal approval link
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default PaymentModel;
