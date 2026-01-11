export const BOOKING_VALIDATION_LIMITS = {
  REFERENCE: {
    MIN: 8,
    MAX: 20,
  },
  GUESTS: {
    ADULT_MIN: 1,
    CHILD_MIN: 0,
    INFANT_MIN: 0,
  },
  PRICE: {
    MIN: 0,
  },
  LOCATION: {
    MIN: 3,
    MAX: 100,
  },
} as const;

export default BOOKING_VALIDATION_LIMITS;
