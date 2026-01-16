import { notFound } from "next/navigation";
import { getRecipeById, getRecipeCategories } from "@/actions/recipes";
import { getIngredients } from "@/actions/items";
import { getUnits } from "@/actions/units";
import { transformRecipeForForm } from "../helpers/recipe-form-helpers";
import RecipeFormClient from "./RecipeFormClient";

interface RecipeFormWithDataProps {
  recipeId?: string; // Optional - if provided, we're editing; if not, we're creating
}

/**
 * Shared server component that fetches reference data and optional recipe data
 * Used by both create and edit routes
 */
export default async function RecipeFormWithData({
  recipeId,
}: RecipeFormWithDataProps) {
  // If editing, fetch recipe data along with reference data
  if (recipeId) {
    const [recipe, recipeCategories, ingredients, units] = await Promise.all([
      getRecipeById(recipeId),
      getRecipeCategories(),
      getIngredients(),
      getUnits(),
    ]);

    if (!recipe) {
      notFound();
    }

    // Extract owner ID, handling null case
    const recipeOwnerId = recipe.createdById;
    if (!recipeOwnerId) {
      notFound();
    }

    const recipeForForm = transformRecipeForForm(recipe);

    return (
      <RecipeFormClient
        recipe={recipeForForm}
        recipeOwnerId={recipeOwnerId}
        recipeCategories={recipeCategories}
        ingredients={ingredients}
        units={units}
      />
    );
  }

  // If creating, just fetch reference data
  const [recipeCategories, ingredients, units] = await Promise.all([
    getRecipeCategories(),
    getIngredients(),
    getUnits(),
  ]);

  return (
    <RecipeFormClient
      recipeCategories={recipeCategories}
      ingredients={ingredients}
      units={units}
    />
  );
}
