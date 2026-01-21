export const ROOM_VALIDATION_LIMITS = {
  NAME: {
    MIN: 2,
    MAX: 100,
  },
  OCCUPANCY: {
    MIN: 1,
  },
  PRICE: {
    MIN: 0,
  },
} as const;
