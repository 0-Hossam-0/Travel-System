import CAR_BOOKING_LIMITS from "../../limit/booking/carBooking.limit";

export const CAR_BOOKING_MESSAGES = {
  PICKUP_LOCATION_REQUIRED: "Pickup location is required",
  DROPOFF_LOCATION_REQUIRED: "Drop-off location is required",
  LOCATION_SHORT: `Location must be at least ${CAR_BOOKING_LIMITS.LOCATION.MIN} characters`,
  LOCATION_LONG: `Location cannot exceed ${CAR_BOOKING_LIMITS.LOCATION.MAX} characters`,
  FULL_NAME_SHORT: "Full name must be at least 2 characters",
  LICENSE_SHORT: "License number must be at least 5 characters",
  INVALID_EMAIL: "Please provide a valid email address",

  PICKUP_DATE_REQUIRED: "Pickup date is required",
  DROPOFF_DATE_REQUIRED: "Drop-off date is required",
  DATE_ORDER: "Drop-off date must be after the pickup date",

  CAR_REQUIRED: "Please select a car for this booking",
  DAILY_RATE_REQUIRED: "Daily rental rate is required",
  DAILY_RATE_MIN: `Daily rate must be at least ${CAR_BOOKING_LIMITS.DAILY_RATE.MIN}`,
  RENTAL_DAYS_REQUIRED: "Rental duration is required",
  RENTAL_DAYS_MIN: `Rental duration must be at least ${CAR_BOOKING_LIMITS.RENTAL.MIN_DAYS} day`,

  LICENSE_EXPIRY_REQUIRED: "Driver's license expiry date is required",
  PHONE_REQUIRED: "Driver's contact phone number is required",
  AGE_REQUIRED: "Driver's age is required",
  AGE_MIN: `Driver must be at least ${CAR_BOOKING_LIMITS.DRIVER.AGE_MIN} years old`,

  INSURANCE_TYPE_INVALID: "Insurance type must be basic, premium, or full",
  INSURANCE_PRICE_MIN: "Insurance price cannot be negative",
  REFERENCE_UNIQUE: "Booking reference must be unique",
} as const;

export default CAR_BOOKING_MESSAGES;
