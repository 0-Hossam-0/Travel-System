import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../utils/response/error.response";
import { ZodObject } from "zod";

export const validateRequest = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // .safeParseAsync returns an object: { success: true, data: ... }
    // OR { success: false, error: ... }
    const result = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // If validation fails
    if (!result.success) {
      const formattedMessage = result.error.issues
        .map((issue) => {
          // Extracts the field name (e.g., 'email')
          const field = issue.path[issue.path.length - 1];
          return `${field.toString()}: ${issue.message}`;
        })
        .join(", ");

      // Pass the formatted string to your global error handler
      return next(new BadRequestException(formattedMessage));
    }

    // If validation succeeds, you can optionally override req with parsed data
    // to handle transformed values (like strings to dates/numbers)
    // req.body = result.data.body;
    // req.query = result.data.query;
    // req.params = result.data.params;

    return next();
  };
};
