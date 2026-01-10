import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFlight extends Document {
  flight_number: string;
  carrier_id: Types.ObjectId;
  origin_airport_id: Types.ObjectId;
  dest_airport_id: Types.ObjectId;
  departure_at: Date;
  arrival_at: Date;
  duration: number;
  status: "scheduled" | "delayed" | "departed" | "arrived" | "cancelled";
}

const flightSchema = new Schema<IFlight>(
  {
    flight_number: { type: String, required: true, uppercase: true },
    carrier_id: { type: Schema.Types.ObjectId, ref: "Carrier", required: true },
    origin_airport_id: {
      type: Schema.Types.ObjectId,
      ref: "Airport",
      required: true,
    },
    dest_airport_id: {
      type: Schema.Types.ObjectId,
      ref: "Airport",
      required: true,
    },
    departure_at: { type: Date, required: true },
    arrival_at: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: ["scheduled", "delayed", "departed", "arrived", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

flightSchema.index({
  departure_at: 1,
  origin_airport_id: 1,
  dest_airport_id: 1,
});

export const Flight = mongoose.model<IFlight>("Flight", flightSchema);
