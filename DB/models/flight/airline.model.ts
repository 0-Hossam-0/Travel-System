import mongoose, { Schema, Document } from "mongoose";

export interface IAirline extends Document {
  name: string;
  code: string;
  country?: string;
  logoUrl?: string;
}

const airlineSchema = new Schema<IAirline>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  country: { type: String },
  logoUrl: { type: String },
}, { timestamps: true });

export const Airline = mongoose.model<IAirline>("Airline", airlineSchema);
