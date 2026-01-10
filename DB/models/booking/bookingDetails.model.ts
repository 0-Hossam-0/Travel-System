import mongoose, { Types, Document, Schema } from "mongoose";

export interface IBookingDetail extends Document {
  booking_id: Types.ObjectId;
  meta: Record<string, any>;
}

const bookingDetailSchema = new Schema<IBookingDetail>(
  {
    booking_id: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const BookingDetail = mongoose.model<IBookingDetail>(
  "BookingDetail",
  bookingDetailSchema
);
