import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../utils/response/error.response";
import { ZodObject } from "zod";

export const validateRequest = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });


    if (!result.success) {
      const formattedMessage = result.error.issues
        .map((issue) => {
          const field = issue.path.at(-1);
          return `${String(field)}: ${issue.message}`;
        })
        .join(", ");

      return next(new BadRequestException(formattedMessage));
    }

    return next();
  };
};



export const validateFileUploaded = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new BadRequestException("No File Uploaded"));
  }
  next();
};