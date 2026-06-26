import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If it's a Zod validation error
  if (err instanceof ZodError) {
    const errorDetails = err.errors.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorDetails
    });
    return;
  }

  // Handle standard business logic exceptions
  const message = err.message || 'Internal Server Error';
  let statusCode = 400; // Default to Bad Request for business rule violations

  if (message.includes('not found')) {
    statusCode = 404; // Not Found
  } else if (message.includes('cannot be modified') || message.includes('cannot be deleted')) {
    statusCode = 403; // Forbidden
  } else if (message.includes('Internal Server Error')) {
    statusCode = 500;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
