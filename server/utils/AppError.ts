/**
 * Custom Error Class for the Application
 * Extends the built-in Error class to include HTTP status codes and operational flags.
 * 
 * @param {number} statusCode - The HTTP status code (e.g., 400, 401, 404, 500)
 * @param {string} message - The error message
 * @param {boolean} isOperational - Flag to distinguish between operational (expected) and programming (unexpected) errors
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
