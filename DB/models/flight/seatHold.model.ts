import { Schema, model, Types } from "mongoose";

export interface ISeatHold {
  seatId: Types.ObjectId;
  bookingId: Types.ObjectId;
  expiresAt: Date;
}

const SeatHoldSchema = new Schema<ISeatHold>(
  {
    seatId: {
      type: Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
      index: true,
    },

    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

SeatHoldSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const SeatHold = model<ISeatHold>("SeatHold", SeatHoldSchema);
