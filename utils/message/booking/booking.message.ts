import BOOKING_VALIDATION_LIMITS from "../../limit/booking/booking.limit";

export const BOOKING_VALIDATION_MESSAGES = {
  USER_REQUIRED: "User ID is required",
  TOTAL_PRICE_POSITIVE: "Total price must be a positive number",
  STATUS_INVALID: "Invalid booking status provided",
  PAYMENT_STATUS_INVALID: "Invalid payment status provided",
  REFERENCE_REQUIRED: "Booking reference is required",
  REFERENCE_LENGTH: `Reference must be between ${BOOKING_VALIDATION_LIMITS.REFERENCE.MIN} and ${BOOKING_VALIDATION_LIMITS.REFERENCE.MAX} characters`,
  DATE_REQUIRED: "Date is required",
  DATE_ORDER_INVALID:
    "The end date/drop-off must be after the start date/pick-up",
  ADULT_REQUIRED: "At least one adult is required for this booking",
  GUEST_COUNT_INVALID: "Guest count cannot be a negative number",
  LOCATION_REQUIRED: "Location is required",
  LOCATION_MIN: `Location must be at least ${BOOKING_VALIDATION_LIMITS.LOCATION.MIN} characters`,
} as const;

export default BOOKING_VALIDATION_MESSAGES;
