const USER_VALIDATION_REGEX = {
  OBJECTID:/^[0-9a-fA-F]{24}$/,
  USERNAME: /^[A-Z][a-z]+\s[A-Z][a-z]+$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
  PHONE_NUMBER:/^\+20(10|11|12|15)\d{8}$/,
} as const;

export default USER_VALIDATION_REGEX;
