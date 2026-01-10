import mongoose, { Schema, Types } from "mongoose";
import { IRoom } from "../../../schema/room/room.schema";
import { ROOM_VALIDATION_MESSAGES } from "../../../utils/message/room/room.message";
import { ROOM_VALIDATION_LIMITS } from "../../../utils/limit/room/room.limit";

const roomSchema = new Schema<IRoom>(
  {
    hotel_id: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, ROOM_VALIDATION_MESSAGES.HOTEL_ID_REQUIRED],
    },
    name: {
      type: String,
      required: [true, ROOM_VALIDATION_MESSAGES.NAME_REQUIRED],
      trim: true,
      minlength: [
        ROOM_VALIDATION_LIMITS.NAME.MIN,
        ROOM_VALIDATION_MESSAGES.NAME_MIN,
      ],
      maxlength: [
        ROOM_VALIDATION_LIMITS.NAME.MAX,
        ROOM_VALIDATION_MESSAGES.NAME_MAX,
      ],
    },
    occupancy: {
      type: Number,
      required: [true, ROOM_VALIDATION_MESSAGES.OCCUPANCY_REQUIRED],
      min: [
        ROOM_VALIDATION_LIMITS.OCCUPANCY.MIN,
        ROOM_VALIDATION_MESSAGES.OCCUPANCY_MIN,
      ],
    },
    price_per_night: {
      type: Number,
      required: [true, ROOM_VALIDATION_MESSAGES.PRICE_REQUIRED],
      min: [
        ROOM_VALIDATION_LIMITS.PRICE.MIN,
        ROOM_VALIDATION_MESSAGES.PRICE_MIN,
      ],
    },
    refundable: {
      type: Boolean,
      default: true,
    },
    availability_calendar: [
      {
        start_date: {
          type: Date,
          required: [true, ROOM_VALIDATION_MESSAGES.DATE_REQUIRED],
        },
        end_date: {
          type: Date,
          required: [true, ROOM_VALIDATION_MESSAGES.DATE_REQUIRED],
        },
        status: {
          type: String,
          enum: {
            values: ["available", "booked", "maintenance"],
            message: ROOM_VALIDATION_MESSAGES.STATUS_ENUM,
          },
          default: "available",
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

roomSchema.index({ hotel_id: 1, price_per_night: 1, occupancy: 1 });

export const RoomModel = mongoose.model<IRoom>("Room", roomSchema);
