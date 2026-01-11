import TOUR_BOOKING_LIMITS from "../../limit/booking/tourBooking.limit";

const TOUR_BOOKING_MESSAGES = {
  TOUR_REQUIRED: "Please select a tour to book",
  DATE_REQUIRED: "Please select a valid tour date",
  ADULT_MIN: `At least ${TOUR_BOOKING_LIMITS.GUESTS.ADULT_MIN} adult is required`,
  CHILD_MIN: "Child count cannot be negative",
  INFANT_MIN: "Infant count cannot be negative",
  TOTAL_EXCEEDED: `Total guests cannot exceed ${TOUR_BOOKING_LIMITS.GUESTS.TOTAL_MAX}`,
} as const;

export default TOUR_BOOKING_MESSAGES;
