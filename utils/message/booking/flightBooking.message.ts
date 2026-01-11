const FLIGHT_BOOKING_MESSAGES = {
  TRIP_TYPE_REQUIRED:
    "Trip type is required (one-way, round-trip, or multi-city)",
  CABIN_CLASS_INVALID: "Invalid cabin class selection",
  TITLE_INVALID: "Please select a valid title (Mr, Mrs, Ms, Miss, Dr)",
  FIRST_NAME_REQUIRED: "Passenger first name is required",
  LAST_NAME_REQUIRED: "Passenger last name is required",
  DOB_REQUIRED: "Passenger date of birth is required",
  SEGMENTS_REQUIRED: "At least one flight segment is required",
  PASSENGERS_REQUIRED: "At least one passenger is required",
} as const;

export default FLIGHT_BOOKING_MESSAGES;
