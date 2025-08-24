import { z } from "zod";
import { ValidationError } from "@/lib/errors";

/**
 * Security utilities for input validation and sanitization
 */

/**
 * Validates MongoDB ObjectId format
 * @param id - The string to validate as ObjectId
 * @returns boolean indicating if the id is a valid ObjectId
 */
export function isValidObjectId(id: string): boolean {
  // MongoDB ObjectId is exactly 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Validates a single ObjectId and throws ValidationError if invalid
 * @param id - The ObjectId string to validate
 * @param fieldName - Name of the field for error messages
 * @returns The validated ObjectId string
 * @throws ValidationError if the ObjectId is invalid
 */
export function validateObjectId(id: string, fieldName = "id"): string {
  if (!isValidObjectId(id)) {
    throw new ValidationError(`Invalid ${fieldName} format`, fieldName);
  }
  return id;
}

/**
 * Validates an array of ObjectIds and throws ValidationError if any are invalid
 * @param ids - Array of ObjectId strings to validate
 * @param fieldName - Name of the field for error messages
 * @returns The validated array of ObjectId strings
 * @throws ValidationError if any ObjectId is invalid
 */
export function validateObjectIds(ids: string[], fieldName = "ids"): string[] {
  const invalidIds = ids.filter((id) => !isValidObjectId(id));
  if (invalidIds.length > 0) {
    throw new ValidationError(
      `Invalid ${fieldName} format: ${invalidIds.join(", ")}`,
      fieldName
    );
  }
  return ids;
}

/**
 * Validates an optional ObjectId (can be null/undefined)
 * @param id - The optional ObjectId string to validate
 * @param fieldName - Name of the field for error messages
 * @returns The validated ObjectId string or null/undefined
 * @throws ValidationError if the ObjectId is invalid (but not if null/undefined)
 */
export function validateOptionalObjectId(
  id: string | null | undefined,
  fieldName = "id"
): string | null | undefined {
  if (id && !isValidObjectId(id)) {
    throw new ValidationError(`Invalid ${fieldName} format`, fieldName);
  }
  return id;
}

/**
 * Zod schema for MongoDB ObjectId validation
 */
export const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid ObjectId format",
});

/**
 * Zod schema for optional MongoDB ObjectId validation
 */
export const optionalObjectIdSchema = z
  .string()
  .refine(isValidObjectId, {
    message: "Invalid ObjectId format",
  })
  .optional()
  .nullable();

/**
 * Zod schema for array of MongoDB ObjectIds
 */
export const objectIdArraySchema = z.array(objectIdSchema);

/**
 * Sanitizes string input to prevent basic injection attacks
 * @param input - The string to sanitize
 * @param maxLength - Maximum allowed length (default: 1000)
 * @returns Sanitized string
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  return (
    input
      .trim()
      .slice(0, maxLength)
      // Remove null bytes and other control characters
      .replace(/[\x00-\x1F\x7F]/g, "")
  );
}

/**
 * Validates and sanitizes user ID for DAL functions
 * @param userId - The user ID to validate
 * @returns Validated user ID
 * @throws ValidationError if invalid
 */
export function validateUserId(userId: string): string {
  return validateObjectId(userId, "userId");
}

/**
 * Validates and sanitizes recipe ID for DAL functions
 * @param recipeId - The recipe ID to validate
 * @returns Validated recipe ID
 * @throws ValidationError if invalid
 */
export function validateRecipeId(recipeId: string): string {
  return validateObjectId(recipeId, "recipeId");
}

/**
 * Validates and sanitizes item ID for DAL functions
 * @param itemId - The item ID to validate
 * @returns Validated item ID
 * @throws ValidationError if invalid
 */
export function validateItemId(itemId: string): string {
  return validateObjectId(itemId, "itemId");
}

/**
 * Validates pagination parameters
 * @param page - Page number (1-based)
 * @param pageSize - Number of items per page
 * @returns Validated pagination parameters
 */
export function validatePagination(
  page: number = 1,
  pageSize: number = 10
): { page: number; pageSize: number } {
  const validatedPage = Math.max(1, Math.floor(page));
  const validatedPageSize = Math.max(1, Math.min(100, Math.floor(pageSize))); // Cap at 100 items

  return { page: validatedPage, pageSize: validatedPageSize };
}

/**
 * Validates numeric range parameters
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fieldName - Name of the field for error messages
 * @returns Validated range
 */
export function validateRange(
  min?: number,
  max?: number,
  fieldName = "range"
): { min?: number; max?: number } {
  if (min !== undefined && max !== undefined && min > max) {
    throw new ValidationError(
      `${fieldName} minimum cannot be greater than maximum`,
      fieldName
    );
  }

  return { min, max };
}

/**
 * Validates that all referenced database entities exist for recipe creation
 * This ensures data integrity by checking that category IDs, item IDs, and unit IDs
 * actually exist in the database before allowing recipe creation
 * @param data - The recipe creation input data
 * @throws ValidationError if any referenced entities don't exist
 */
export async function validateRecipeReferences(data: {
  categoryIds: string[];
  ingredients: Array<{
    itemId: string;
    unitId?: string | null;
    quantity: number;
  }>;
}): Promise<void> {
  const { prisma } = await import("@/lib/prisma");

  // Validate that all category IDs exist
  const categories = await prisma.recipeCategory.findMany({
    where: {
      id: { in: data.categoryIds },
    },
  });

  if (categories.length !== data.categoryIds.length) {
    throw new ValidationError("One or more categories do not exist");
  }

  // Validate that all item IDs exist
  const itemIds = data.ingredients.map((i) => i.itemId);
  const items = await prisma.item.findMany({
    where: {
      id: { in: itemIds },
    },
  });

  if (items.length !== itemIds.length) {
    throw new ValidationError("One or more ingredients do not exist");
  }

  // Validate unit IDs if provided
  const unitIds = data.ingredients
    .map((i) => i.unitId)
    .filter((id): id is string => id !== null && id !== undefined);

  if (unitIds.length > 0) {
    const units = await prisma.unit.findMany({
      where: {
        id: { in: unitIds },
      },
    });

    if (units.length !== unitIds.length) {
      throw new ValidationError("One or more units do not exist");
    }
  }
}
