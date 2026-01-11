const GeneralFields = Object.freeze({
  MONGO_ID_REGEX: /^[0-9a-fA-F]{24}$/,
  USERNAME_REGEX: /^[A-Z][a-z]+\s[A-Z][a-z]+$/,
  PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/,
});

