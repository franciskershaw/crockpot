"use server";

import {
  getRecipes as getRecipesFromDAL,
  getRecipeTimeRange as getRecipeTimeRangeFromDAL,
  getRecipeCategories as getRecipeCategoriesFromDAL,
} from "@/data/recipes/getRecipes";
import { getRecipeById as getRecipeByIdFromDAL } from "@/data/recipes/getRecipeById";
import { createRecipe as createRecipeDAL } from "@/data/recipes/createRecipe";
import { editRecipe as editRecipeDAL } from "@/data/recipes/editRecipe";
import { deleteRecipe as deleteRecipeDAL } from "@/data/recipes/deleteRecipe";
import { getRecipesForAdminPanel } from "@/data/recipes/getRecipesForAdmin";
import { updateRecipeStatus as updateRecipeStatusDAL } from "@/data/recipes/updateRecipeStatus";
import { bulkUpdateRecipeStatus as bulkUpdateRecipeStatusDAL } from "@/data/recipes/bulkUpdateRecipeStatus";
import { RecipeFilters } from "@/data/types";
import {
  createPublicAction,
  extractRecipeFormData,
  extractEditRecipeFormData,
  canEditRecipe,
  canDeleteRecipe,
  canViewRecipe,
  withPermission,
  Permission,
} from "@/lib/action-helpers";
import { createRecipeSchema, updateRecipeSchema } from "@/lib/validations";
import { validateRecipeReferences } from "@/lib/security";
import { processRecipeImage, deleteRecipeImage } from "@/lib/upload-helpers";
import { UserRole } from "@/data/types";
import { getUserRecipeCount } from "@/data/recipes/getUserRecipeCount";
import { ForbiddenError } from "@/lib/errors";

export interface GetRecipesParams {
  page?: number;
  pageSize?: number;
  filters?: RecipeFilters;
  seed?: number;
}

export const getRecipes = createPublicAction(
  async ({
    page = 1,
    pageSize = 10,
    filters = {},
    seed,
  }: GetRecipesParams = {}) => {
    return await getRecipesFromDAL({
      page,
      pageSize,
      filters,
      seed,
    });
  }
);

export const getRecipeTimeRange = createPublicAction(async () => {
  return await getRecipeTimeRangeFromDAL();
});

export const getRecipeCategories = createPublicAction(async () => {
  return await getRecipeCategoriesFromDAL();
});

export const getRecipeById = createPublicAction(async (id: string) => {
  const recipe = await getRecipeByIdFromDAL(id);

  if (!recipe) {
    return null;
  }

  // Get the current user's ID (if authenticated)
  const { auth } = await import("@/auth");
  const session = await auth();
  const userId = session?.user?.id ?? null;

  // Check if the user can view this recipe
  if (!(await canViewRecipe(userId, id))) {
    return null;
  }

  return recipe;
});

export const createRecipe = withPermission(
  Permission.CREATE_RECIPES,
  async (user, formData: FormData) => {
    // Check if the user has created 5 recipes already
    const userRecipeCount = await getUserRecipeCount(user.id);
    if (
      (user.role === UserRole.FREE && userRecipeCount >= 5) ||
      (user.role === UserRole.PREMIUM && userRecipeCount >= 10)
    ) {
      throw new ForbiddenError(
        "You have reached the maximum number of free recipes"
      );
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

    return {
      success: true,
      recipe,
      message: isApproved
        ? "Recipe created successfully!"
        : "Recipe created successfully and is pending approval",
    };
  }
);

export const editRecipe = withPermission(
  Permission.CREATE_RECIPES,
  async (user, formData: FormData) => {
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

    return {
      success: true,
      recipe,
      message: "Recipe updated successfully!",
    };
  }
);

export const deleteRecipe = withPermission(
  Permission.CREATE_RECIPES,
  async (user: { id: string; role: UserRole }, recipeId: string) => {
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

    return {
      success: true,
      recipe: deletedRecipe,
      message: "Recipe deleted successfully!",
    };
  }
);

// Admin actions
export const getRecipesForAdminPanelAction = withPermission(
  Permission.ADMIN_PANEL,
  async () => {
    return await getRecipesForAdminPanel();
  }
);

export const updateRecipeStatus = withPermission(
  Permission.ADMIN_PANEL,
  async (
    _user,
    { recipeId, approved }: { recipeId: string; approved: boolean }
  ) => {
    const recipe = await updateRecipeStatusDAL(recipeId, approved);

    return {
      success: true,
      recipe,
      message: `Recipe ${approved ? "approved" : "rejected"} successfully!`,
    };
  }
);

export const bulkUpdateRecipeStatus = withPermission(
  Permission.ADMIN_PANEL,
  async (
    _user,
    { recipeIds, approved }: { recipeIds: string[]; approved: boolean }
  ) => {
    const result = await bulkUpdateRecipeStatusDAL(recipeIds, approved);

    return {
      success: true,
      count: result.count,
      message: `${result.count} recipe(s) ${
        approved ? "approved" : "rejected"
      } successfully!`,
    };
  }
);
