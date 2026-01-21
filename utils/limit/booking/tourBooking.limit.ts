const TOUR_BOOKING_LIMITS = {
  GUESTS: {
    ADULT_MIN: 1,
    CHILD_MIN: 0,
    INFANT_MIN: 0,
    TOTAL_MAX: 20,
  },
} as const;

export default TOUR_BOOKING_LIMITS;
