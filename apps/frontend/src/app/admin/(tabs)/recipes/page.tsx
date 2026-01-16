import { getRecipesForAdminPanelAction } from "@/actions/recipes";
import { RecipesDataTable } from "./components/RecipesDataTable";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const recipes = await getRecipesForAdminPanelAction();

  return <RecipesDataTable data={recipes} />;
}
