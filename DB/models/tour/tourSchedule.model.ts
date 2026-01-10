import mongoose, { Schema, Document } from "mongoose";
import { ITourSchedule } from "../../../schema/tour/tourSchedule.schema";
import TOUR_SCHEDULE_VALIDATION_MESSAGES from "../../../utils/message/tour/tourSchedule.message";

export interface ITourScheduleDocument extends ITourSchedule, Document {}

const tourScheduleSchema = new Schema<ITourScheduleDocument>(
  {
    tour_id: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, TOUR_SCHEDULE_VALIDATION_MESSAGES.TOUR_ID_REQUIRED],
      index: true,
    },
    price_tier_id: {
      type: Schema.Types.ObjectId,
      ref: "Tour-Price-Tier",
      required: [
        true,
        TOUR_SCHEDULE_VALIDATION_MESSAGES.PRICE_TIER_ID_REQUIRED,
      ],
    },
    start_date: {
      type: Date,
      required: [true, TOUR_SCHEDULE_VALIDATION_MESSAGES.START_DATE_REQUIRED],
      index: true,
    },
    end_date: {
      type: Date,
      required: [true, TOUR_SCHEDULE_VALIDATION_MESSAGES.END_DATE_REQUIRED],
    },
    capacity: {
      type: Number,
      required: [true, TOUR_SCHEDULE_VALIDATION_MESSAGES.CAPACITY_REQUIRED],
      min: [1, TOUR_SCHEDULE_VALIDATION_MESSAGES.MIN_CAPACITY],
    },
    available_slots: {
      type: Number,
      required: [
        true,
        TOUR_SCHEDULE_VALIDATION_MESSAGES.AVAILABLE_SLOTS_REQUIRED,
      ],
      min: [0, TOUR_SCHEDULE_VALIDATION_MESSAGES.MIN_SLOTS],
    },
  },
  {
    timestamps: true,
  }
);

tourScheduleSchema.index({ tour_id: 1, start_date: 1, available_slots: 1 });

tourScheduleSchema.virtual("isFull").get(function () {
  return this.available_slots! <= 0;
});

const TourScheduleModel = mongoose.model<ITourScheduleDocument>(
  "Tour-Schedule",
  tourScheduleSchema
);

export default TourScheduleModel;
