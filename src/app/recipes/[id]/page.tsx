import { getRecipeById } from "@/actions/recipes";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RecipeHero } from "./components/RecipeHero";
import { RecipeContent } from "./components/RecipeContent";
import { RecipeContentSkeleton } from "./components/RecipeContentSkeleton";
import { BackButton } from "./components/BackButton";

interface RecipePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

const RecipePage = async ({ params, searchParams }: RecipePageProps) => {
  const { id } = await params;
  const { from } = await searchParams;

  const [recipe, session] = await Promise.all([getRecipeById(id), auth()]);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Actions - renders immediately with server data */}
      <div className="relative">
        <RecipeHero recipe={recipe} session={session} />
        <BackButton from={from} />
      </div>

      {/* Main Content - use Suspense for progressive loading */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <Suspense fallback={<RecipeContentSkeleton />}>
          <RecipeContent recipe={recipe} />
        </Suspense>
      </div>
    </div>
  );
};

export default RecipePage;
