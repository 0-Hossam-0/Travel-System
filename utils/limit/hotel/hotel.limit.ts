export const HOTEL_VALIDATION_LIMITS = {
  NAME: {
    MIN: 2,
    MAX: 100,
  },
  ADDRESS: {
    MIN: 5,
    MAX: 500,
  },
  RATING: {
    MIN: 0,
    MAX: 5,
  },
} as const;
