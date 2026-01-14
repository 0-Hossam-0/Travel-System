const FAVORITE_VALIDATION_MESSAGES = {
  USER_REQUIRED: "User ID is required",
  CATEGORY_REQUIRED: "Category is required",
  CATEGORY_INVALID: "Category must be either Tour, Flight, Car, or Hotel",
  ITEM_REQUIRED: "Item ID is required",
  INVALID_ID: "The provided ID is not a valid MongoDB ObjectId",
} as const;

export default FAVORITE_VALIDATION_MESSAGES;
