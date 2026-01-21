import { Request, Response, NextFunction } from "express";
import { ValidationException } from "../../utils/response/error.response";


export const validateHoldSeats = (req: Request, res: Response, next: NextFunction) => {
  const { flightId, seatIds, holdDurationMinutes } = req.body;

  if (!flightId || typeof flightId !== "string") {
    throw new ValidationException("Valid flightId is required");
  }

  if (!Array.isArray(seatIds) || seatIds.length === 0) {
    throw new ValidationException("seatIds must be a non-empty array");
  }

  if (seatIds.some((id) => typeof id !== "string")) {
    throw new ValidationException("All seatIds must be strings");
  }

  if (holdDurationMinutes !== undefined) {
    if (typeof holdDurationMinutes !== "number" || holdDurationMinutes < 1 || holdDurationMinutes > 60) {
      throw new ValidationException("holdDurationMinutes must be between 1 and 60");
    }
  }

  next();
};


export const validateCompleteBooking = (req: Request, res: Response, next: NextFunction) => {
  const { passengers, totalPrice, currency } = req.body;

  if (!Array.isArray(passengers) || passengers.length === 0) {
    throw new ValidationException("passengers must be a non-empty array");
  }

  for (const passenger of passengers) {
    if (!passenger.fullName || typeof passenger.fullName !== "string") {
      throw new ValidationException("Each passenger must have a valid fullName");
    }
    if (!passenger.passportNumber || typeof passenger.passportNumber !== "string") {
      throw new ValidationException("Each passenger must have a valid passportNumber");
    }
  }

  if (typeof totalPrice !== "number" || totalPrice <= 0) {
    throw new ValidationException("totalPrice must be a positive number");
  }

  if (currency && typeof currency !== "string") {
    throw new ValidationException("currency must be a string");
  }

  next();
};


export const validateConfirmPayment = (req: Request, res: Response, next: NextFunction) => {
  const { paymentSuccess } = req.body;

  if (typeof paymentSuccess !== "boolean") {
    throw new ValidationException("paymentSuccess must be a boolean");
  }

  next();
};


export const validateObjectId = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!id || !objectIdRegex.test(id)) {
      throw new ValidationException(`Invalid ${paramName} format`);
    }

    next();
  };
};