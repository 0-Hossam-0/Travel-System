import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

interface ValidationSchemas {
  body?: Schema;
  params?: Schema;
  query?: Schema;
}

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const { error, value } = schemas.body.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          return res.status(400).json({
            success: false,
            message: "Validation error (body)",
            errors: error.details.map((err) => err.message),
          });
        }

        req.body = value;
      }

      if (schemas.params) {
        const { error, value } = schemas.params.validate(req.params, {
          abortEarly: false,
        });

        if (error) {
          return res.status(400).json({
            success: false,
            message: "Validation error (params)",
            errors: error.details.map((err) => err.message),
          });
        }

        req.params = value;
      }

      if (schemas.query) {
        const { error, value } = schemas.query.validate(req.query, {
          abortEarly: false,
        });

        if (error) {
          return res.status(400).json({
            success: false,
            message: "Validation error (query)",
            errors: error.details.map((err) => err.message),
          });
        }

        req.query = value;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
