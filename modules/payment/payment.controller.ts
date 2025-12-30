import { Request, Response, NextFunction } from "express";
import { createPayment, capturePayment } from "./payment.service";
import { successResponse } from "../../utils/response/success.response";

export const createPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, amount, method, description } = req.body;

    const result = await createPayment({
      bookingId,
      amount,
      method,
      description,
    });

    return successResponse(res, {
      message: "Payment created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const capturePaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.params;

    const payment = await capturePayment(paymentId);

    return successResponse(res, {
      message: "Payment completed successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
