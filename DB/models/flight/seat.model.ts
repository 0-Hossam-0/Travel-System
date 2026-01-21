import { Schema, model, Types } from "mongoose";

export type SeatStatus = "AVAILABLE" | "HELD" | "BOOKED";

export interface ISeat {
  flightId: Types.ObjectId;
  seatNumber: string;                 // 12A
  class: "economy" | "business" | "first";
  status: SeatStatus;
}

const SeatSchema = new Schema<ISeat>(
  {
    flightId: {
      type: Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
      index: true,
    },

    seatNumber: {
      type: String,
      required: true,
    },

    class: {
      type: String,
      enum: ["economy", "business", "first"],
      required: true,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "HELD", "BOOKED"],
      default: "AVAILABLE",
      index: true,
    },
  },
  { timestamps: false }
);

// مهم جدًا: يمنع تكرار نفس المقعد لنفس الرحلة
SeatSchema.index(
  { flightId: 1, seatNumber: 1 },
  { unique: true }
);

export const Seat = model<ISeat>("Seat", SeatSchema);
