import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission, Permission } from "@/lib/action-helpers";
import CreateRecipeForm from "./components/CreateRecipeForm";
import { getRecipeCategories } from "@/actions/recipes";
import { getIngredients } from "@/actions/items";
import { getUnits } from "@/actions/units";
import { getUserRecipeCount } from "@/data/recipes/getUserRecipeCount";
import { UserRole } from "@/data/types";

export default async function NewRecipePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Double-check permission on the server side
  const userRole = session.user.role;
  if (!hasPermission(userRole, Permission.CREATE_RECIPES)) {
    redirect("/your-crockpot");
  }

  // Check recipe limit before loading the form
  const userRecipeCount = await getUserRecipeCount(session.user.id);
  const hasReachedLimit =
    (userRole === UserRole.FREE && userRecipeCount >= 5) ||
    (userRole === UserRole.PREMIUM && userRecipeCount >= 10);

  if (hasReachedLimit) {
    redirect("/your-crockpot");
  }

  const recipeCategories = await getRecipeCategories();
  const ingredients = await getIngredients();
  const units = await getUnits();

  return (
    <div className="container mx-auto md:px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Create New Recipe
        </h1>
        <p className="text-gray-600 mt-2">
          Share your culinary creation with the community
        </p>
      </div>
      <CreateRecipeForm
        recipeCategories={recipeCategories}
        ingredients={ingredients}
        units={units}
      />
    </div>
  );
}
