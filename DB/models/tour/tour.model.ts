import mongoose, { Types, Document, Schema } from "mongoose";
import { ITour } from "../../../schema/tour/tour.schema";
import TOUR_VALIDATION_MESSAGES from "../../../utils/message/tour/tour.message";
import TOUR_VALIDATION_LIMITS from "../../../utils/limit/tour/tour.limit";
import REGEX_PATTERNS from "../../../utils/regex/regex";

export interface ITourDocument extends ITour, Document {
  price_tiers?: Types.ObjectId[];
  schedules?: Types.ObjectId[];
}

const tourSchema = new Schema<ITourDocument>(
  {
    title: {
      type: String,
      required: [true, TOUR_VALIDATION_MESSAGES.TITLE_REQUIRED],
      trim: true,
      minlength: [
        TOUR_VALIDATION_LIMITS.TITLE.MIN,
        TOUR_VALIDATION_MESSAGES.TITLE_MIN,
      ],
      maxlength: [
        TOUR_VALIDATION_LIMITS.TITLE.MAX,
        TOUR_VALIDATION_MESSAGES.TITLE_MAX,
      ],
    },
    slug: {
      type: String,
      required: [true, TOUR_VALIDATION_MESSAGES.SLUG_REQUIRED],
      unique: true,
      trim: true,
      match: [REGEX_PATTERNS.SLUG, TOUR_VALIDATION_MESSAGES.SLUG_INVALID],
    },
    main_image: {
      type: String,
      required: [true, TOUR_VALIDATION_MESSAGES.MAIN_IMAGE_REQUIRED],
    },
    description: {
      type: String,
      required: [true, TOUR_VALIDATION_MESSAGES.DESC_REQUIRED],
      minlength: [
        TOUR_VALIDATION_LIMITS.DESCRIPTION.MIN,
        TOUR_VALIDATION_MESSAGES.DESC_MIN,
      ],
      maxlength: [
        TOUR_VALIDATION_LIMITS.DESCRIPTION.MAX,
        TOUR_VALIDATION_MESSAGES.DESC_MAX,
      ],
    },
    duration: {
      type: Number,
      required: [true, TOUR_VALIDATION_MESSAGES.DURATION_REQUIRED],
      min: [
        TOUR_VALIDATION_LIMITS.DURATION.MIN_MS,
        TOUR_VALIDATION_MESSAGES.DURATION_MIN,
      ],
    },
    location: {
      type: String,
      required: [true, TOUR_VALIDATION_MESSAGES.LOCATION_REQUIRED],
      trim: true,
    },
    recommended: {
      type: Boolean,
      default: false,
    },
    created_by: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, TOUR_VALIDATION_MESSAGES.CREATED_BY_ID_REQUIRED],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual("price_tiers", {
  ref: "Tour-Price-Tier",
  localField: "_id",
  foreignField: "tour_id",
});

tourSchema.virtual("schedules", {
  ref: "Tour-Schedule",
  localField: "_id",
  foreignField: "tour_id",
});

const TourModel = mongoose.model<ITourDocument>("Tour", tourSchema);

export default TourModel;
