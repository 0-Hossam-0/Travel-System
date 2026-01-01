import mongoose, { Schema, Types } from "mongoose";
import { PaymentMethod, PaymentStatus } from "../../utils/payment/payment.types";

export interface IPayment extends mongoose.Document {
  userId?: Types.ObjectId;
  tourId?: Types.ObjectId;
  bookingId?: Types.ObjectId;
  amount: number;
  currency: string;
  description?: string;
  method: PaymentMethod;
  status: PaymentStatus;
  providerPaymentId?: string;
  approvalUrl?: string;
  paidAt?: Date;
  payerDetails?: {
    name?: string;
    email?: string;
  };
}

const paymentSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
    },

    tourId: {
      type: Types.ObjectId,
      ref: "Tour",
      index: true,
    },

    bookingId: {
      type: Types.ObjectId,
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

    description: {
      type: String,
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
      type: String,
    },

    approvalUrl: {
      type: String,
    },

    paidAt: {
      type: Date,
    },


    payerDetails: {
      name: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema);

export default PaymentModel;
