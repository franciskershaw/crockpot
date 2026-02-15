import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRecipe } from "@/app/recipes/[id]/page";

import CreateRecipeForm from "../../new/components/CreateRecipeForm";

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
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="container mx-auto md:px-4 py-6 max-w-4xl">
      {/* Static content - renders immediately */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Edit Recipe
        </h1>
        <p className="text-gray-600 mt-2">Edit your culinary creation</p>
      </div>

      <CreateRecipeForm recipe={recipe} />
    </div>
  );
}
