export const CAR_BOOKING_LIMITS = {
  LOCATION: {
    MIN: 2,
    MAX: 100,
  },
  DRIVER: {
    NAME_MIN: 2,
    LICENSE_MIN: 5,
    AGE_MIN: 18,
  },
  RENTAL: {
    MIN_DAYS: 1,
  },
  INSURANCE: {
    PRICE_MIN: 0,
  },
  DAILY_RATE: {
    MIN: 0.01,
  },
} as const;

export default CAR_BOOKING_LIMITS;
