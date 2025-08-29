import { auth } from "@/auth";
import { z } from "zod";
import { UserRole } from "@/data/types";
import {
  AuthError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ServerError,
} from "@/lib/errors";

/**
 * Permission levels for different features
 */
export enum Permission {
  VIEW_RECIPES = "VIEW_RECIPES", // Not logged in + all others
  MANAGE_FAVOURITES = "MANAGE_FAVOURITES", // FREE + paid + admin
  MANAGE_MENU = "MANAGE_MENU", // FREE + paid + admin
  CREATE_RECIPES = "CREATE_RECIPES", // PREMIUM + PRO + admin
  CREATE_ITEMS = "CREATE_ITEMS", // PREMIUM + PRO + admin
  AI_FEATURES = "AI_FEATURES", // PRO + admin
  ADMIN_PANEL = "ADMIN_PANEL", // ADMIN only
  APPROVE_CONTENT = "APPROVE_CONTENT", // ADMIN only
}

/**
 * Role hierarchy mapping - higher values include permissions of lower values
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  FREE: 1,
  PREMIUM: 2,
  PRO: 3,
  ADMIN: 4,
};

/**
 * Permission requirements mapping
 */
const PERMISSION_REQUIREMENTS: Record<Permission, UserRole[]> = {
  [Permission.VIEW_RECIPES]: [], // No authentication required
  [Permission.MANAGE_FAVOURITES]: [
    UserRole.FREE,
    UserRole.PREMIUM,
    UserRole.PRO,
    UserRole.ADMIN,
  ],
  [Permission.MANAGE_MENU]: [
    UserRole.FREE,
    UserRole.PREMIUM,
    UserRole.PRO,
    UserRole.ADMIN,
  ],
  [Permission.CREATE_RECIPES]: [UserRole.PREMIUM, UserRole.PRO, UserRole.ADMIN],
  [Permission.CREATE_ITEMS]: [UserRole.PREMIUM, UserRole.PRO, UserRole.ADMIN],
  [Permission.AI_FEATURES]: [UserRole.PRO, UserRole.ADMIN],
  [Permission.ADMIN_PANEL]: [UserRole.ADMIN],
  [Permission.APPROVE_CONTENT]: [UserRole.ADMIN],
};

/**
 * Helper function to check if a role has permission for a specific action
 */
export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  const allowedRoles = PERMISSION_REQUIREMENTS[permission];
  return allowedRoles.includes(userRole);
}

/**
 * Helper function to check if a role meets minimum requirement
 */
export function hasMinimumRole(
  userRole: UserRole,
  minimumRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

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
 * Helper function to get authenticated user with role information
 * Throws AuthError if user is not authenticated
 */
export async function getAuthenticatedUser(): Promise<{
  id: string;
  role: UserRole;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthError("Please sign in to continue");
  }
  return {
    id: session.user.id,
    role: session.user.role as UserRole,
  };
}

/**
 * Helper function to get authenticated user with permission verification
 * Throws AuthError if user is not authenticated
 * Throws ForbiddenError if user doesn't have required permission
 */
export async function getAuthenticatedUserWithPermission(
  permission: Permission
): Promise<{ id: string; role: UserRole }> {
  const user = await getAuthenticatedUser();

  if (!hasPermission(user.role, permission)) {
    const permissionName = permission.toLowerCase().replace(/_/g, " ");
    throw new ForbiddenError(`You don't have permission to ${permissionName}`);
  }

  return user;
}

/**
 * Helper function to get authenticated user with minimum role verification
 * Throws AuthError if user is not authenticated
 * Throws ForbiddenError if user doesn't meet minimum role requirement
 */
export async function getAuthenticatedUserWithMinimumRole(
  minimumRole: UserRole
): Promise<{ id: string; role: UserRole }> {
  const user = await getAuthenticatedUser();

  if (!hasMinimumRole(user.role, minimumRole)) {
    throw new ForbiddenError(
      `This feature requires ${minimumRole.toLowerCase()} access or higher`
    );
  }

  return user;
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
  handler: (userId: string, ...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return withErrorHandling(async (...args: TArgs): Promise<TReturn> => {
    const userId = await getAuthenticatedUserId();
    return await handler(userId, ...args);
  });
}

/**
 * Permission-based authentication wrapper for server actions
 * Provides authenticated user with role to the handler after permission check
 */
export function withPermission<TArgs extends unknown[], TReturn>(
  permission: Permission,
  handler: (
    user: { id: string; role: UserRole },
    ...args: TArgs
  ) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return withErrorHandling(async (...args: TArgs): Promise<TReturn> => {
    const user = await getAuthenticatedUserWithPermission(permission);
    return await handler(user, ...args);
  });
}

/**
 * Role-based authentication wrapper for server actions
 * Provides authenticated user with role to the handler after role check
 */
export function withMinimumRole<TArgs extends unknown[], TReturn>(
  minimumRole: UserRole,
  handler: (
    user: { id: string; role: UserRole },
    ...args: TArgs
  ) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return withErrorHandling(async (...args: TArgs): Promise<TReturn> => {
    const user = await getAuthenticatedUserWithMinimumRole(minimumRole);
    return await handler(user, ...args);
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
  ) => Promise<TReturn>
): (input: TInput, ...args: TArgs) => Promise<TReturn> {
  return withErrorHandling(
    async (input: TInput, ...args: TArgs): Promise<TReturn> => {
      const userId = await getAuthenticatedUserId();
      const validatedInput = validateInput(schema, input);
      return await handler(validatedInput, userId, ...args);
    }
  );
}

/**
 * Combined permission check and validation wrapper
 * For actions that need permission verification and input validation
 */
export function withPermissionAndValidation<
  TInput,
  TArgs extends unknown[],
  TReturn
>(
  permission: Permission,
  schema: z.ZodSchema<TInput>,
  handler: (
    validatedInput: TInput,
    user: { id: string; role: UserRole },
    ...args: TArgs
  ) => Promise<TReturn>
): (input: TInput, ...args: TArgs) => Promise<TReturn> {
  return withErrorHandling(
    async (input: TInput, ...args: TArgs): Promise<TReturn> => {
      const user = await getAuthenticatedUserWithPermission(permission);
      const validatedInput = validateInput(schema, input);
      return await handler(validatedInput, user, ...args);
    }
  );
}

/**
 * Combined role check and validation wrapper
 * For actions that need role verification and input validation
 */
export function withRoleAndValidation<TInput, TArgs extends unknown[], TReturn>(
  minimumRole: UserRole,
  schema: z.ZodSchema<TInput>,
  handler: (
    validatedInput: TInput,
    user: { id: string; role: UserRole },
    ...args: TArgs
  ) => Promise<TReturn>
): (input: TInput, ...args: TArgs) => Promise<TReturn> {
  return withErrorHandling(
    async (input: TInput, ...args: TArgs): Promise<TReturn> => {
      const user = await getAuthenticatedUserWithMinimumRole(minimumRole);
      const validatedInput = validateInput(schema, input);
      return await handler(validatedInput, user, ...args);
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

/**
 * Helper function to extract form data with potential prefixed keys
 * Handles React 19 potential prefixing of form field names
 */
export function extractFormData(formData: FormData) {
  const getFormValue = (key: string): string | File | null => {
    // Try exact key first
    const value = formData.get(key);
    if (value !== null) return value;

    // Try with React 19 potential prefix
    for (const [formKey, formValue] of formData.entries()) {
      if (formKey.endsWith(`_${key}`)) {
        return formValue;
      }
    }

    return null;
  };

  return { getFormValue };
}

/**
 * Extract basic recipe form data (common between create and edit)
 */
export function extractRecipeFormData(formData: FormData) {
  const { getFormValue } = extractFormData(formData);

  const name = getFormValue("name") as string;
  const timeInMinutes = parseInt(getFormValue("timeInMinutes") as string);
  const serves = parseInt(getFormValue("serves") as string);
  const categoryIds = JSON.parse(getFormValue("categoryIds") as string);
  const ingredients = JSON.parse(getFormValue("ingredients") as string);
  const instructions = JSON.parse(getFormValue("instructions") as string);
  const notes = JSON.parse((getFormValue("notes") as string) || "[]");
  const imageFile = getFormValue("image") as File | null;

  return {
    name,
    timeInMinutes,
    serves,
    categoryIds,
    ingredients,
    instructions,
    notes,
    imageFile,
  };
}

/**
 * Extract edit-specific recipe form data
 */
export function extractEditRecipeFormData(formData: FormData) {
  const { getFormValue } = extractFormData(formData);

  const basicData = extractRecipeFormData(formData);
  const hasImageChanged = getFormValue("hasImageChanged") === "true";
  const currentImageFilename = getFormValue("currentImageFilename") as
    | string
    | null;

  return {
    ...basicData,
    hasImageChanged,
    currentImageFilename,
  };
}

/**
 * Check if user can edit a recipe (either creator or admin)
 */
export async function canEditRecipe(
  userId: string,
  recipeId: string
): Promise<boolean> {
  const { prisma } = await import("@/lib/prisma");

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { createdById: true },
  });

  if (!recipe) {
    return false;
  }

  // User can edit if they created the recipe
  if (recipe.createdById === userId) {
    return true;
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}
