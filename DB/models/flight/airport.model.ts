import mongoose, { Schema, Document } from "mongoose";

export interface IAirport extends Document {
  name: string;
  code: string;
  city?: string;
  country?: string;
}

const airportSchema = new Schema<IAirport>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  city: { type: String },
  country: { type: String },
}, { timestamps: true });

export const Airport = mongoose.model<IAirport>("Airport", airportSchema);
