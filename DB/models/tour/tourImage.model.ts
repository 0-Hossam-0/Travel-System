import mongoose, { Schema, Document } from "mongoose";
import { ITourImage } from "../../../schema/tour/tourImage.schema";

export interface ITourImageDocument extends ITourImage, Document {}

const tourImageSchema = new Schema<ITourImageDocument>(
  {
    tour_id: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    url: { type: String, required: true },
    caption: { type: String, trim: true },
  },
  { timestamps: true }
);

const TourImageModel = mongoose.model<ITourImageDocument>(
  "Tour-Image",
  tourImageSchema
);

export default TourImageModel;
