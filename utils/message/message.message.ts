const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field: string, max: number) =>
    `${field} cannot exceed ${max} characters`,
  INVALID_FORMAT: (field: string) => `Invalid ${field} format`,
  INVALID_ID: "Invalid ID provided",
  POSITIVE_NUMBER: (field: string) => `${field} must be a positive number`,
  SLUG_ERROR: "Slug must be URL-friendly (e.g., 'luxury-desert-tour')",
  INVALID_OTP: (digits: number | string) =>
    `OTP must be exactly ${digits} digits`,
} as const;

export default VALIDATION_MESSAGES;
