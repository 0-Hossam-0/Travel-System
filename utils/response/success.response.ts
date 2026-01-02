import { Response } from "express";

interface SuccessResponseParams {
  statusCode?: number;
  message?: string;
  info?: string | object;
  data?: any;
}

export const successResponse = (
  res: Response,
  { statusCode = 200, message = "Done", info, data }: SuccessResponseParams
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    info,
    data,
  });
};
