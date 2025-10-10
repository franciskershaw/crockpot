import CreateRecipeForm from "./CreateRecipeForm";
import { getRecipeCategories } from "@/actions/recipes";
import { getIngredients } from "@/actions/items";
import { getUnits } from "@/actions/units";

export default async function CreateRecipeFormLoader() {
  const [recipeCategories, ingredients, units] = await Promise.all([
    getRecipeCategories(),
    getIngredients(),
    getUnits(),
  ]);

  return (
    <CreateRecipeForm
      recipeCategories={recipeCategories}
      ingredients={ingredients}
      units={units}
    />
  );
}
