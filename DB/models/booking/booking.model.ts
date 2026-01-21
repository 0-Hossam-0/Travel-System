import mongoose, { Schema } from "mongoose";
import BOOKING_VALIDATION_MESSAGES from "../../../utils/message/booking/booking.message";
import BOOKING_VALIDATION_LIMITS from "../../../utils/limit/booking/booking.limit";
import { IBooking } from "../../../schema/booking/booking.schema";

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, BOOKING_VALIDATION_MESSAGES.USER_REQUIRED],
    },
    total_price: {
      type: Number,
      required: [true, BOOKING_VALIDATION_MESSAGES.TOTAL_PRICE_POSITIVE],
      min: [
        BOOKING_VALIDATION_LIMITS.PRICE.MIN,
        BOOKING_VALIDATION_MESSAGES.TOTAL_PRICE_POSITIVE,
      ],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "cancelled", "failed"],
        message: BOOKING_VALIDATION_MESSAGES.STATUS_INVALID,
      },
      default: "pending",
    },
    payment_status: {
      type: String,
      enum: {
        values: ["pending", "paid", "refunded", "failed"],
        message: BOOKING_VALIDATION_MESSAGES.PAYMENT_STATUS_INVALID,
      },
      default: "pending",
    },
    payment_id: { type: String },
    booking_reference: {
      type: String,
      required: [true, BOOKING_VALIDATION_MESSAGES.REFERENCE_REQUIRED],
      unique: true,
      minlength: [
        BOOKING_VALIDATION_LIMITS.REFERENCE.MIN,
        BOOKING_VALIDATION_MESSAGES.REFERENCE_LENGTH,
      ],
      maxlength: [
        BOOKING_VALIDATION_LIMITS.REFERENCE.MAX,
        BOOKING_VALIDATION_MESSAGES.REFERENCE_LENGTH,
      ],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    discriminatorKey: "type",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);

// /**
//  * 2. TOUR BOOKING DISCRIMINATOR
//  */
// const TourBookingSchema = new Schema<ITourBooking>({
//   tour: { type: Schema.Types.ObjectId, ref: "Tour", required: true },
//   selected_date: {
//     type: Date,
//     required: [true, BOOKING_VALIDATION_MESSAGES.DATE_REQUIRED],
//   },
//   guests: {
//     adult: {
//       type: Number,
//       required: true,
//       min: [
//         BOOKING_VALIDATION_LIMITS.GUESTS.ADULT_MIN,
//         BOOKING_VALIDATION_MESSAGES.ADULT_REQUIRED,
//       ],
//     },
//     child: {
//       type: Number,
//       default: 0,
//       min: [0, BOOKING_VALIDATION_MESSAGES.GUEST_COUNT_INVALID],
//     },
//     infant: {
//       type: Number,
//       default: 0,
//       min: [0, BOOKING_VALIDATION_MESSAGES.GUEST_COUNT_INVALID],
//     },
//   },
//   price_breakdown: {
//     adult_quantity: { type: Number, required: true },
//     adult_price: { type: Number, required: true },
//     child_quantity: { type: Number, default: 0 },
//     child_price: { type: Number, default: 0 },
//     infant_quantity: { type: Number, default: 0 },
//     infant_price: { type: Number, default: 0 },
//     total: { type: Number, required: true },
//   },
// });

// export const TourBookingModel = BookingModel.discriminator(
//   "tour",
//   TourBookingSchema
// );
