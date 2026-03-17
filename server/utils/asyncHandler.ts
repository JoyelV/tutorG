import { Request, Response, NextFunction } from 'express';

/**
 * Higher-order function to wrap async controllers.
 * Eliminates the need for repetitive try-catch blocks.
 * Errors are automatically passed to the next() middleware (global error handler).
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
