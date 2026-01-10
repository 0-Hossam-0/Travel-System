const USER_VALIDATION_REGEX = {
  USERNAME: /^[A-Z][a-z]+\s[A-Z][a-z]+$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
} as const;

export default USER_VALIDATION_REGEX;
