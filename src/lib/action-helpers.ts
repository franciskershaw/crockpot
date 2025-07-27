import { auth } from "@/auth";
import { z } from "zod";
import { AuthError, ValidationError } from "@/lib/errors";

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
