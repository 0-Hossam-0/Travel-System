import mongoose, { Document, Types, Schema } from "mongoose";

export interface IFlightFare extends Document {
  flight_id: Types.ObjectId;
  cabin_class: "economy" | "premium_economy" | "business" | "first";
  price: number;
  seats_left: number;
  fare_rules_id: Types.ObjectId;
}

const flightFareSchema = new Schema<IFlightFare>(
  {
    flight_id: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
    cabin_class: {
      type: String,
      enum: ["economy", "premium_economy", "business", "first"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    seats_left: { type: Number, required: true, min: 0 },
    fare_rules_id: { type: Schema.Types.ObjectId, ref: "FareRule" },
  },
  { timestamps: true }
);

export const FlightFare = mongoose.model<IFlightFare>(
  "FlightFare",
  flightFareSchema
);
