import { Schema, Types, model, Document } from "mongoose";

export interface IPassenger {
  fullName: string;
  passportNumber: string;
  nationality?: string;
  dateOfBirth?: Date;
}

export type BookingStatus =
  | "INIT"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PAYMENT_FAILED"
  | "EXPIRED"
  | "CANCELLED";

export interface IBooking extends Document {
  flightId: Types.ObjectId;

  passengers: IPassenger[];

  seatIds: Types.ObjectId[]; 

  totalPrice: number;
  currency: string;

  status: BookingStatus;

  expiresAt?: Date; 
}

const FlightBookingSchema = new Schema<IBooking>({
  flightId: {
    type: Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
    index: true,
  },

  passengers: [
    {
      fullName: { type: String, required: true },
      passportNumber: { type: String, required: true },
      nationality: String,
      dateOfBirth: Date,
    },
  ],

  seatIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Seat",
    },
  ],

  totalPrice: {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    default: "USD",
  },

  status: {
    type: String,
    enum: [
      "INIT",
      "PENDING_PAYMENT",
      "CONFIRMED",
      "PAYMENT_FAILED",
      "EXPIRED",
      "CANCELLED",
    ],
    default: "INIT",
    index: true,
  },

  expiresAt: {
    type: Date,
    index: true,
  },
});

export const FlightBookingModel = model<IBooking>("FlightBooking", FlightBookingSchema);
