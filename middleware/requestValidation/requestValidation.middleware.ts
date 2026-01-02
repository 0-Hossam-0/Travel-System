import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../utils/response/error.response";
import { ZodObject, ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errorDetails = result.error.issues.map((issue) => {
        return {
          field: issue.path[issue.path.length - 1] || "root",
          message: issue.message,
        };
      });

      return next(new BadRequestException("Validation Error", errorDetails));
    }

    return next();
  };
};
