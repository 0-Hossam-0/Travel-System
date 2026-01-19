import { Request, Response, NextFunction } from "express";

/**
 * Async Handler Wrapper
 * Wraps async route handlers to automatically catch errors and pass them to next()
 * This eliminates the need for try-catch blocks in every controller method
 * 
 * @param fn - The async function to wrap
 * @returns A new function that calls the original and catches any errors
 * 
 * @example
 * router.get('/example', asyncHandler(async (req, res) => {
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
