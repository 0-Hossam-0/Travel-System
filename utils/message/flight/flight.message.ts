import { FLIGHT_VALIDATION_LIMITS } from "../../limit/flight/fight.limit";

export const FLIGHT_VALIDATION_MESSAGES = {
  ID_REQUIRED: "ID is required",
  INVALID_ID: "Invalid database ID provided",
  FLIGHT_NUMBER_REQUIRED: "Flight number is required",
  FLIGHT_NUMBER_MIN: `Flight number must be at least ${FLIGHT_VALIDATION_LIMITS.FLIGHT_NUMBER.MIN} characters`,
  FLIGHT_NUMBER_MAX: `Flight number cannot exceed ${FLIGHT_VALIDATION_LIMITS.FLIGHT_NUMBER.MAX} characters`,
  CARRIER_REQUIRED: "Carrier ID is required",
  ORIGIN_REQUIRED: "Origin airport is required",
  DESTINATION_REQUIRED: "Destination airport is required",
  DEPARTURE_REQUIRED: "Departure time is required",
  ARRIVAL_REQUIRED: "Arrival time is required",
  DURATION_REQUIRED: "Flight duration is required",
  DURATION_MIN: "Duration must be at least 1 minute",
  STATUS_ENUM:
    "Status must be: scheduled, delayed, departed, arrived, or cancelled",
  DATE_ORDER_INVALID: "Arrival time must be after departure time",
} as const;

export default FLIGHT_VALIDATION_MESSAGES;
