import { auth } from "@/auth";
import { z } from "zod";

/**
 * Helper function to get authenticated user ID
 * Throws error if user is not authenticated
 */
export async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }
  return session.user.id;
}

/**
 * Helper function to validate input with Zod schema
 * Returns parsed and validated input
 */
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  return schema.parse(input);
}
