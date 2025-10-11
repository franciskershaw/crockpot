import { getRecipeCategories } from "@/actions/recipes";
import { getIngredients } from "@/actions/items";
import { getUnits } from "@/actions/units";
import CreateRecipeFormClient from "./CreateRecipeFormClient";

/**
 * Server component that fetches static reference data
 * and passes it to the client component for rendering
 */
export default async function CreateRecipeFormWithAuth() {
  // Fetch reference data on server (static, cacheable)
  const [recipeCategories, ingredients, units] = await Promise.all([
    getRecipeCategories(),
    getIngredients(),
    getUnits(),
  ]);

  return (
    <CreateRecipeFormClient
      recipeCategories={recipeCategories}
      ingredients={ingredients}
      units={units}
    />
  );
}
