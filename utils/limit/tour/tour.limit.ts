const TOUR_VALIDATION_LIMITS = {
  TITLE: {
    MIN: 3,
    MAX: 100,
  },
  DESCRIPTION: {
    MIN: 10,
    MAX: 2000,
  },
  DURATION: {
    MIN_MS: 3600000, // 1 Hour
  },
} as const;

export default TOUR_VALIDATION_LIMITS;
