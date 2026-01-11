export const FLIGHT_VALIDATION_LIMITS = {
  FLIGHT_NUMBER: {
    MIN: 3,
    MAX: 10,
  },
  DURATION: {
    MIN: 1, // Minutes
  },
} as const;

export default FLIGHT_VALIDATION_LIMITS;
