import { auth } from "@/auth";
import { z } from "zod";
import { AuthError, ValidationError, ForbiddenError } from "@/lib/errors";

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
