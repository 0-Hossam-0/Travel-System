import { Schema, model } from "mongoose";

export interface ICarrier {
  name: string;
  iataCode: string;   // MS, EK
  icaoCode?: string;  // MSR, UAE
  country?: string;
  logoUrl?: string;
  isActive: boolean;
}

const CarrierSchema = new Schema<ICarrier>(
  {
    name: { type: String, required: true },

    iataCode: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      index: true,
    },

    icaoCode: {
      type: String,
      uppercase: true,
    },

    country: String,

    logoUrl: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Carrier = model<ICarrier>("Carrier", CarrierSchema);
