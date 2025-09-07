import { getRecipesForAdminPanelAction } from "@/actions/recipes";
import { RecipesDataTable } from "./components/RecipesDataTable";

export default async function RecipesPage() {
  const recipes = await getRecipesForAdminPanelAction();

  return (
    <div className="bg-white rounded-lg border p-6">
      <RecipesDataTable data={recipes} />
    </div>
  );
}
