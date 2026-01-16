import { getRecipeTimeRange, getRecipeCategories } from "@/actions/recipes";
import { getIngredients } from "@/actions/items";
import BrowseHeader from "./Header";

export default async function BrowseHeaderWithData() {
  // Fetch data in parallel for this component
  const [timeRange, categories, ingredients] = await Promise.all([
    getRecipeTimeRange(),
    getRecipeCategories(),
    getIngredients(),
  ]);

  return (
    <BrowseHeader
      categories={categories}
      timeRange={timeRange}
      ingredients={ingredients}
    />
  );
}
