import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

/**
 * Global Error Handling Middleware
 * Catch-all for any error thrown in the system.
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let { statusCode, message } = err;

    // If error is not an AppError (e.g. library error), default to 500
    if (!(err instanceof AppError)) {
        statusCode = statusCode || 500;
        message = message || 'Internal Server Error';
    }

    // Log the error for developers (use a real logger in full production)
    logger.error(`[ERROR] ${req.method} ${req.path} -> ${message}`);

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        // Hide stack trace in production for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
