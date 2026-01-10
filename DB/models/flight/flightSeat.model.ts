import mongoose, { Document, Types, Schema } from "mongoose";

export interface IFlightSeat extends Document {
  flight_id: Types.ObjectId;
  seat_label: string;
  seat_class: "economy" | "premium_economy" | "business" | "first";
  is_available: boolean;
}

const flightSeatSchema = new Schema<IFlightSeat>(
  {
    flight_id: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
    seat_label: { type: String, required: true },
    seat_class: {
      type: String,
      enum: ["economy", "premium_economy", "business", "first"],
      required: true,
    },
    is_available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

flightSeatSchema.index({ flight_id: 1, sea  t_label: 1 }, { unique: true });

export const FlightSeat = mongoose.model<IFlightSeat>(
  "FlightSeat",
  flightSeatSchema
);
