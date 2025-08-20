import { auth } from "@/auth";
import { z } from "zod";
import {
  AuthError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ServerError,
} from "@/lib/errors";

/**
 * Helper function to get authenticated user ID
 * Throws AuthError if user is not authenticated
 */
export async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthError("Please sign in to continue");
  }
  return session.user.id;
}

/**
 * Helper function to get authenticated user with admin verification
 * Throws AuthError if user is not authenticated
 * Throws ForbiddenError if user is not an admin
 */
export async function getAuthenticatedAdminUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthError("Please sign in to continue");
  }

  // Re-verify admin status from database to prevent client-side manipulation
  if (!session.user.isAdmin) {
    throw new ForbiddenError("Admin access required");
  }

  return session.user.id;
}

/**
 * Helper function to get authenticated user ID with optional admin check
 * @param requireAdmin - Whether admin privileges are required
 */
export async function getAuthenticatedUserIdWithRole(
  requireAdmin = false
): Promise<string> {
  if (requireAdmin) {
    return getAuthenticatedAdminUserId();
  }
  return getAuthenticatedUserId();
}

/**
 * Helper function to validate input with Zod schema
 * Throws ValidationError if validation fails
 */
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Extract the first validation error
      const firstError = error.errors[0];
      const field = firstError.path.join(".");
      const message = firstError.message;

      throw new ValidationError(
        field ? `${field}: ${message}` : message,
        field || undefined
      );
    }

    throw new ValidationError("Invalid input");
  }
}

/**
 * Automatic error handling wrapper for server actions
 * Catches unexpected errors and provides consistent error responses
 */
function withErrorHandling<TArgs extends unknown[], TReturn>(
  handler: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Re-throw known errors as-is
      if (
        error instanceof AuthError ||
        error instanceof ValidationError ||
        error instanceof ForbiddenError ||
        error instanceof NotFoundError ||
        error instanceof ServerError
      ) {
        throw error;
      }

      // Log unexpected errors and throw generic server error
      console.error("Unexpected server action error:", error);
      throw new ServerError("An unexpected error occurred");
    }
  };
}

/**
 * Authentication wrapper for server actions
 * Provides authenticated user ID to the handler
 */
export function withAuthentication<TArgs extends unknown[], TReturn>(
  handler: (userId: string, ...args: TArgs) => Promise<TReturn>,
  options: {
    requireAdmin?: boolean;
  } = {}
): (...args: TArgs) => Promise<TReturn> {
  const { requireAdmin = false } = options;

  return withErrorHandling(async (...args: TArgs): Promise<TReturn> => {
    const userId = await getAuthenticatedUserIdWithRole(requireAdmin);
    return await handler(userId, ...args);
  });
}

/**
 * Input validation wrapper for server actions
 * Validates input against a Zod schema before passing to handler
 */
export function withValidation<TInput, TArgs extends unknown[], TReturn>(
  schema: z.ZodSchema<TInput>,
  handler: (validatedInput: TInput, ...args: TArgs) => Promise<TReturn>
): (input: TInput, ...args: TArgs) => Promise<TReturn> {
  return withErrorHandling(
    async (input: TInput, ...args: TArgs): Promise<TReturn> => {
      const validatedInput = validateInput(schema, input);
      return await handler(validatedInput, ...args);
    }
  );
}

/**
 * Combined authentication and validation wrapper
 * For actions that need both user authentication and input validation
 */
export function withAuthAndValidation<TInput, TArgs extends unknown[], TReturn>(
  schema: z.ZodSchema<TInput>,
  handler: (
    validatedInput: TInput,
    userId: string,
    ...args: TArgs
  ) => Promise<TReturn>,
  options: {
    requireAdmin?: boolean;
  } = {}
): (input: TInput, ...args: TArgs) => Promise<TReturn> {
  const { requireAdmin = false } = options;

  return withErrorHandling(
    async (input: TInput, ...args: TArgs): Promise<TReturn> => {
      const userId = await getAuthenticatedUserIdWithRole(requireAdmin);
      const validatedInput = validateInput(schema, input);
      return await handler(validatedInput, userId, ...args);
    }
  );
}

/**
 * Public server action wrapper
 * For actions that don't require authentication or validation
 * Includes automatic error handling
 */
export function createPublicAction<TArgs extends unknown[], TReturn>(
  handler: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return withErrorHandling(handler);
}
