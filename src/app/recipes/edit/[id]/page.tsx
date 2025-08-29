import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { hasPermission, Permission } from "@/lib/action-helpers";
import CreateRecipeForm from "@/app/recipes/new/components/CreateRecipeForm";
import { getRecipeById, getRecipeCategories } from "@/actions/recipes";
import { getIngredients } from "@/actions/items";
import { getUnits } from "@/actions/units";
import { transformRecipeForForm } from "@/app/recipes/new/helpers/recipe-form-helpers";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  // Double-check permission on the server side
  const userRole = session.user.role;
  if (!hasPermission(userRole, Permission.CREATE_RECIPES)) {
    redirect("/your-crockpot?error=premium-required");
  }

  const recipeCategories = await getRecipeCategories();
  const ingredients = await getIngredients();
  const units = await getUnits();

  // Transform recipe data to match CreateRecipeInput format
  const recipeForForm = transformRecipeForForm(recipe);

  return (
    <div className="container mx-auto md:px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Edit {recipe.name}
        </h1>
        <p className="text-gray-600 mt-2">Edit your culinary creation</p>
      </div>
      <CreateRecipeForm
        recipeCategories={recipeCategories}
        ingredients={ingredients}
        units={units}
        recipe={recipeForForm}
      />
    </div>
  );
}
