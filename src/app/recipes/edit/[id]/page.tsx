import { Suspense } from "react";
import RecipeFormWithData from "@/app/recipes/new/components/RecipeFormWithData";
import CreateRecipeFormSkeleton from "@/app/recipes/new/components/CreateRecipeFormSkeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Recipe",
  description: "Edit your recipe details, ingredients, and instructions.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Recipe edit page - renders immediately with static shell
 * Auth and data fetching handled via Suspense boundaries
 */
export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto md:px-4 py-6 max-w-4xl">
      {/* Static content - renders immediately */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Edit Recipe
        </h1>
        <p className="text-gray-600 mt-2">Edit your culinary creation</p>
      </div>

      {/* Form streams in via Suspense */}
      <Suspense fallback={<CreateRecipeFormSkeleton />}>
        <RecipeFormWithData recipeId={id} />
      </Suspense>
    </div>
  );
}
