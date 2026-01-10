import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
  user_id: Types.ObjectId;
  category: "Tour" | "Flight" | "Car" | "Hotel";
  item_id: Types.ObjectId; // Generic ID
  status: "pending" | "confirmed" | "cancelled" | "completed";
  total_price: number;
  payment_status: "unpaid" | "partial" | "paid" | "refunded";
}

const bookingSchema = new Schema<IBooking>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      required: true,
      enum: ["Tour", "Flight", "Car", "Hotel"],
    },
    item_id: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "category",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    total_price: { type: Number, required: true, min: 0 },
    payment_status: {
      type: String,
      enum: ["unpaid", "partial", "paid", "refunded"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ user_id: 1, status: 1 });

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
