export const CAR_VALIDATION_LIMITS = {
  BRAND: {
    MIN: 2,
    MAX: 50,
  },
  MODEL: {
    MIN: 1,
    MAX: 50,
  },
  YEAR: {
    MIN: 1900,
    MAX: new Date().getFullYear() + 1,
  },
  COLOR: {
    MIN: 2,
    MAX: 30,
  },
  PRICE_PER_DAY: {
    MIN: 0,
  },
  SEATS: {
    MIN: 1,
    MAX: 100,
  },
} as const;
