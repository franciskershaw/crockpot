import { getRecipesForAdminPanelAction } from "@/actions/recipes";
import { RecipesDataTable } from "./components/RecipesDataTable";

export default async function RecipesPage() {
  const recipes = await getRecipesForAdminPanelAction();

  return <RecipesDataTable data={recipes} />;
}
