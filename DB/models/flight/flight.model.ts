import { Schema } from "mongoose";
import FLIGHT_VALIDATION_LIMITS from "../../../utils/limit/flight/fight.limit";
import FLIGHT_VALIDATION_MESSAGES from "../../../utils/message/flight/flight.message";
import { IFlight } from "../../../schema/flight/flight.schema";

const flightSchema = new Schema<IFlight>(
  {
    flight_number: {
      type: String,
      required: [true, FLIGHT_VALIDATION_MESSAGES.FLIGHT_NUMBER_REQUIRED],
      uppercase: true,
      minlength: [
        FLIGHT_VALIDATION_LIMITS.FLIGHT_NUMBER.MIN,
        FLIGHT_VALIDATION_MESSAGES.FLIGHT_NUMBER_MIN,
      ],
      maxlength: [
        FLIGHT_VALIDATION_LIMITS.FLIGHT_NUMBER.MAX,
        FLIGHT_VALIDATION_MESSAGES.FLIGHT_NUMBER_MAX,
      ],
    },
    carrier_id: {
      type: Schema.Types.ObjectId,
      ref: "Carrier",
      required: [true, FLIGHT_VALIDATION_MESSAGES.CARRIER_REQUIRED],
    },
    origin_airport_id: {
      type: Schema.Types.ObjectId,
      ref: "Airport",
      required: [true, FLIGHT_VALIDATION_MESSAGES.ORIGIN_REQUIRED],
    },
    dest_airport_id: {
      type: Schema.Types.ObjectId,
      ref: "Airport",
      required: [true, FLIGHT_VALIDATION_MESSAGES.DESTINATION_REQUIRED],
    },
    departure_at: {
      type: Date,
      required: [true, FLIGHT_VALIDATION_MESSAGES.DEPARTURE_REQUIRED],
    },
    arrival_at: {
      type: Date,
      required: [true, FLIGHT_VALIDATION_MESSAGES.ARRIVAL_REQUIRED],
    },
    duration: {
      type: Number,
      required: [true, FLIGHT_VALIDATION_MESSAGES.DURATION_REQUIRED],
      min: [
        FLIGHT_VALIDATION_LIMITS.DURATION.MIN,
        FLIGHT_VALIDATION_MESSAGES.DURATION_MIN,
      ],
    },
    status: {
      type: String,
      enum: {
        values: ["scheduled", "delayed", "departed", "arrived", "cancelled"],
        message: FLIGHT_VALIDATION_MESSAGES.STATUS_ENUM,
      },
      default: "scheduled",
    },
  },
  { timestamps: true }
);
