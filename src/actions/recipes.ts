"use server";

import {
  getRecipes as getRecipesFromDAL,
  getRecipeTimeRange as getRecipeTimeRangeFromDAL,
  getRecipeCategories as getRecipeCategoriesFromDAL,
  getRecipeCount as getRecipeCountFromDAL,
  getRandomRecipes as getRandomRecipesFromDAL,
} from "@/data/recipes/getRecipes";
import { getRecipeById as getRecipeByIdFromDAL } from "@/data/recipes/getRecipeById";
import { createRecipe as createRecipeDAL } from "@/data/recipes/createRecipe";
import { RecipeFilters } from "@/data/types";
import { createPublicAction } from "@/lib/action-helpers";
import { createRecipeSchema } from "@/lib/validations";
import { validateRecipeReferences } from "@/lib/security";
import { processRecipeImage } from "@/lib/upload-helpers";
import { revalidatePath } from "next/cache";

export interface GetRecipesParams {
  page?: number;
  pageSize?: number;
  filters?: RecipeFilters;
}

export const getRecipes = createPublicAction(
  async ({ page = 1, pageSize = 10, filters = {} }: GetRecipesParams = {}) => {
    return await getRecipesFromDAL({
      page,
      pageSize,
      filters,
    });
  }
);

export const getRecipeTimeRange = createPublicAction(async () => {
  return await getRecipeTimeRangeFromDAL();
});

export const getRecipeCategories = createPublicAction(async () => {
  return await getRecipeCategoriesFromDAL();
});

export const getRecipeCount = createPublicAction(
  async (filters: RecipeFilters = {}) => {
    return await getRecipeCountFromDAL(filters);
  }
);

export const getRandomRecipes = createPublicAction(
  async (count: number = 12) => {
    return await getRandomRecipesFromDAL(count);
  }
);

export const getRecipeById = createPublicAction(async (id: string) => {
  return await getRecipeByIdFromDAL(id);
});

// Helper function to extract form data with potential prefixed keys
function extractFormData(formData: FormData) {
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

export async function createRecipe(formData: FormData) {
  "use server";

  try {
    const { hasPermission, Permission, getAuthenticatedUserWithMinimumRole } =
      await import("@/lib/action-helpers");
    const { UserRole } = await import("@prisma/client");

    // Get authenticated user
    const user = await getAuthenticatedUserWithMinimumRole(UserRole.PREMIUM);

    // Check permissions
    if (!hasPermission(user.role, Permission.CREATE_RECIPES)) {
      throw new Error("You don't have permission to create recipes");
    }

    // Extract form data
    const extractedData = extractFormData(formData);

    // Create the recipe data
    const recipeData = {
      name: extractedData.name,
      timeInMinutes: extractedData.timeInMinutes,
      serves: extractedData.serves,
      categoryIds: extractedData.categoryIds,
      ingredients: extractedData.ingredients,
      instructions: extractedData.instructions,
      notes: extractedData.notes,
    };

    // Validate the data
    const validatedInput = createRecipeSchema.parse(recipeData);

    // Start image processing in parallel with database operations
    const imagePromise =
      extractedData.imageFile && extractedData.imageFile.size > 0
        ? processRecipeImage(extractedData.imageFile)
        : Promise.resolve(undefined);

    // Validate references in parallel with image processing
    const [imageData] = await Promise.all([
      imagePromise,
      validateRecipeReferences(validatedInput),
    ]);

    // Create the recipe data with image
    const finalRecipeData = {
      ...validatedInput,
      image: imageData,
    };

    // Auto-approve if user is admin
    const isApproved = user.role === "ADMIN";

    // Create the recipe
    const recipe = await createRecipeDAL(user.id, finalRecipeData, isApproved);

    // Revalidate relevant paths in parallel
    await Promise.all([
      revalidatePath("/recipes"),
      revalidatePath("/your-crockpot"),
    ]);

    return {
      success: true,
      recipe,
      message: isApproved
        ? "Recipe created successfully!"
        : "Recipe created successfully and is pending approval",
    };
  } catch (error) {
    console.error("Recipe creation failed:", error);
    throw error;
  }
}
