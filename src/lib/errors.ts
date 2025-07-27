/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public action?: {
      label: string;
      onClick: () => void;
    }
  ) {
    super(message);
    this.name = this.constructor.name;
    
    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Authentication required error
 */
export class AuthError extends AppError {
  constructor(message = "Authentication required") {
    super(message, "AUTH_REQUIRED", 401);
  }
}

/**
 * Authorization/permission error
 */
export class ForbiddenError extends AppError {
  constructor(message = "You don't have permission to perform this action") {
    super(message, "FORBIDDEN", 403);
  }
}

/**
 * Validation error for form inputs
 */
export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

/**
 * Resource not found error
 */
export class NotFoundError extends AppError {
  constructor(resource = "Resource", id?: string) {
    const message = id 
      ? `${resource} with ID "${id}" not found`
      : `${resource} not found`;
    super(message, "NOT_FOUND", 404);
  }
}

/**
 * Server/database error
 */
export class ServerError extends AppError {
  constructor(message = "An unexpected error occurred") {
    super(message, "SERVER_ERROR", 500);
  }
}

/**
 * Rate limiting error
 */
export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please try again later.") {
    super(message, "RATE_LIMIT", 429);
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
} 