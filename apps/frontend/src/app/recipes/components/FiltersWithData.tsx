import { getRecipeTimeRange, getRecipeCategories } from "@/actions/recipes";
import { getIngredients } from "@/actions/items";
import Filters from "./Filters";

export default async function FiltersWithData() {
  // Fetch data in parallel for this component
  const [timeRange, categories, ingredients] = await Promise.all([
    getRecipeTimeRange(),
    getRecipeCategories(),
    getIngredients(),
  ]);

  return (
    <Filters
      categories={categories}
      timeRange={timeRange}
      ingredients={ingredients}
    />
  );
}
