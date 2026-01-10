const REGEX_PATTERNS = {
  MONGO_ID: /^[0-9a-fA-F]{24}$/,
  SLUG: /^[a-z0-9-]+$/,
} as const;

export default REGEX_PATTERNS;
