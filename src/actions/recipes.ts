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
import { editRecipe as editRecipeDAL } from "@/data/recipes/editRecipe";
import { deleteRecipe as deleteRecipeDAL } from "@/data/recipes/deleteRecipe";
import { RecipeFilters } from "@/data/types";
import {
  createPublicAction,
  extractRecipeFormData,
  extractEditRecipeFormData,
  canEditRecipe,
  canDeleteRecipe,
} from "@/lib/action-helpers";
import { createRecipeSchema, updateRecipeSchema } from "@/lib/validations";
import { validateRecipeReferences } from "@/lib/security";
import { processRecipeImage, deleteRecipeImage } from "@/lib/upload-helpers";
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
    const extractedData = extractRecipeFormData(formData);

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

export async function editRecipe(formData: FormData) {
  "use server";

  try {
    const { hasPermission, Permission, getAuthenticatedUserWithMinimumRole } =
      await import("@/lib/action-helpers");
    const { UserRole } = await import("@prisma/client");

    // Get authenticated user
    const user = await getAuthenticatedUserWithMinimumRole(UserRole.PREMIUM);

    // Check permissions
    if (!hasPermission(user.role, Permission.CREATE_RECIPES)) {
      throw new Error("You don't have permission to edit recipes");
    }

    // Extract form data
    const extractedData = extractEditRecipeFormData(formData);
    const recipeId = formData.get("recipeId") as string;

    if (!recipeId) {
      throw new Error("Recipe ID is required");
    }

    // Check if user can edit this recipe
    if (!(await canEditRecipe(user.id, recipeId))) {
      throw new Error("You don't have permission to edit this recipe");
    }

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
    const validatedInput = updateRecipeSchema.parse(recipeData);

    // Handle image processing only if image has changed
    let imageData: { url: string; filename: string } | null | undefined;
    let shouldDeleteOldImage = false;

    if (extractedData.hasImageChanged) {
      if (extractedData.imageFile && extractedData.imageFile.size > 0) {
        // Process new image
        imageData = await processRecipeImage(extractedData.imageFile);
        shouldDeleteOldImage = !!extractedData.currentImageFilename;
      } else {
        // User removed the image - explicitly set to null to remove it
        imageData = null;
        shouldDeleteOldImage = !!extractedData.currentImageFilename;
      }
    }

    // Validate references only for fields that are being updated
    if (validatedInput.categoryIds || validatedInput.ingredients) {
      const validationData = {
        categoryIds: validatedInput.categoryIds || [],
        ingredients: validatedInput.ingredients || [],
      };
      await validateRecipeReferences(validationData);
    }

    // Create the final recipe data with image
    const finalRecipeData = {
      ...validatedInput,
      ...(extractedData.hasImageChanged && { image: imageData }),
    };

    // Update the recipe
    const recipe = await editRecipeDAL(recipeId, finalRecipeData);

    // Delete old image if needed (don't await to avoid blocking the response)
    if (shouldDeleteOldImage && extractedData.currentImageFilename) {
      deleteRecipeImage(extractedData.currentImageFilename).catch((error) => {
        console.error("Failed to delete old image:", error);
      });
    }

    // Revalidate relevant paths in parallel
    await Promise.all([
      revalidatePath("/recipes"),
      revalidatePath("/your-crockpot"),
      revalidatePath(`/recipes/${recipeId}`),
    ]);

    return {
      success: true,
      recipe,
      message: "Recipe updated successfully!",
    };
  } catch (error) {
    console.error("Recipe update failed:", error);
    throw error;
  }
}

export async function deleteRecipe(recipeId: string) {
  "use server";

  try {
    const { hasPermission, Permission, getAuthenticatedUserWithMinimumRole } =
      await import("@/lib/action-helpers");
    const { UserRole } = await import("@prisma/client");

    // Get authenticated user
    const user = await getAuthenticatedUserWithMinimumRole(UserRole.PREMIUM);

    // Check permissions
    if (!hasPermission(user.role, Permission.CREATE_RECIPES)) {
      throw new Error("You don't have permission to delete recipes");
    }

    // Check if user can delete this recipe
    if (!(await canDeleteRecipe(user.id, recipeId))) {
      throw new Error("You don't have permission to delete this recipe");
    }

    // Get the recipe data before deletion to handle image cleanup
    const { prisma } = await import("@/lib/prisma");
    const recipeToDelete = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { image: true },
    });

    if (!recipeToDelete) {
      throw new Error("Recipe not found");
    }

    // Delete the recipe from database
    const deletedRecipe = await deleteRecipeDAL(recipeId);

    // Delete image from Cloudinary if it exists (don't await to avoid blocking response)
    if (recipeToDelete.image?.filename) {
      deleteRecipeImage(recipeToDelete.image.filename).catch((error) => {
        console.error("Failed to delete image from cloudinary:", error);
      });
    }

    // Revalidate relevant paths in parallel
    await Promise.all([
      revalidatePath("/recipes", "page"),
      revalidatePath("/your-crockpot", "page"),
    ]);

    return {
      success: true,
      recipe: deletedRecipe,
      message: "Recipe deleted successfully!",
    };
  } catch (error) {
    console.error("Recipe deletion failed:", error);
    throw error;
  }
}
