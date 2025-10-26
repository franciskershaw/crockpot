import { getRecipeById } from "@/actions/recipes";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RecipeHero } from "./components/RecipeHero";
import { RecipeContent } from "./components/RecipeContent";
import { RecipeContentSkeleton } from "./components/RecipeContentSkeleton";
import { BackButton } from "./components/BackButton";
import type { Metadata } from "next";

interface RecipePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    return {
      title: "Recipe Not Found",
    };
  }

  // Create a description from the recipe details
  const categoryNames = recipe.categories.map((cat) => cat.name).join(", ");
  const ingredientsList = recipe.ingredients
    .slice(0, 5)
    .map((ing) => ing.item?.name)
    .filter(Boolean)
    .join(", ");

  const description = `${recipe.name} - Ready in ${
    recipe.timeInMinutes
  } minutes, serves ${recipe.serves}. ${
    categoryNames ? `Categories: ${categoryNames}.` : ""
  } ${ingredientsList ? `Main ingredients: ${ingredientsList}.` : ""}`;

  // Truncate to ~160 characters for optimal SEO
  const truncatedDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  const keywords = [
    recipe.name,
    ...recipe.categories.map((cat) => cat.name),
    ...recipe.ingredients.slice(0, 10).map((ing) => ing.item?.name || ""),
    "recipe",
    "cooking",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title: recipe.name,
    description: truncatedDescription,
    keywords,
    openGraph: {
      title: recipe.name,
      description: truncatedDescription,
      type: "article",
      images: recipe.image?.url
        ? [
            {
              url: recipe.image.url,
              width: 1200,
              height: 630,
              alt: recipe.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.name,
      description: truncatedDescription,
      images: recipe.image?.url ? [recipe.image.url] : undefined,
    },
  };
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
      {/* Break out of parent container for full-width hero */}
      <div className="-mx-4 md:mx-0">
        {/* Hero Section with Actions - renders immediately with server data */}
        <div className="relative">
          <RecipeHero recipe={recipe} session={session} />
          <BackButton from={from} />
        </div>
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
