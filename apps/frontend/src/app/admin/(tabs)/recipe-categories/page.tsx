import { getRecipeCategoriesWithUsage } from "@/actions/recipe-categories";
import { RecipeCategoriesDataTable } from "./components/RecipeCategoriesDataTable";

export default async function RecipeCategoriesPage() {
  const recipeCategories = await getRecipeCategoriesWithUsage();
  return <RecipeCategoriesDataTable data={recipeCategories} />;
}


