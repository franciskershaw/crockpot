// import { getRecipeById } from "@/actions/recipes";
// import { auth } from "@/auth";
import { Suspense } from "react";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackButton } from "./components/BackButton";
import { RecipeContent } from "./components/RecipeContent";
import { RecipeContentSkeleton } from "./components/RecipeContentSkeleton";
import { RecipeHero } from "./components/RecipeHero";

interface RecipePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

// export async function generateMetadata({
//   params,
// }: RecipePageProps): Promise<Metadata> {
//   const { id } = await params;
//   const recipe = await getRecipeById(id);

//   if (!recipe) {
//     return {
//       title: "Recipe Not Found",
//     };
//   }

//   // Create a description from the recipe details
//   const categoryNames = recipe.categories.map((cat) => cat.name).join(", ");
//   const ingredientsList = recipe.ingredients
//     .slice(0, 5)
//     .map((ing) => ing.item?.name)
//     .filter(Boolean)
//     .join(", ");

//   const description = `${recipe.name} - Ready in ${
//     recipe.timeInMinutes
//   } minutes, serves ${recipe.serves}. ${
//     categoryNames ? `Categories: ${categoryNames}.` : ""
//   } ${ingredientsList ? `Main ingredients: ${ingredientsList}.` : ""}`;

//   // Truncate to ~160 characters for optimal SEO
//   const truncatedDescription =
//     description.length > 160
//       ? description.substring(0, 157) + "..."
//       : description;

//   const keywords = [
//     recipe.name,
//     ...recipe.categories.map((cat) => cat.name),
//     ...recipe.ingredients.slice(0, 10).map((ing) => ing.item?.name || ""),
//     "recipe",
//     "cooking",
//   ]
//     .filter(Boolean)
//     .join(", ");

//   return {
//     title: recipe.name,
//     description: truncatedDescription,
//     keywords,
//     openGraph: {
//       title: recipe.name,
//       description: truncatedDescription,
//       type: "article",
//       images: recipe.image?.url
//         ? [
//             {
//               url: recipe.image.url,
//               width: 1200,
//               height: 630,
//               alt: recipe.name,
//             },
//           ]
//         : undefined,
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: recipe.name,
//       description: truncatedDescription,
//       images: recipe.image?.url ? [recipe.image.url] : undefined,
//     },
//   };
// }

const getRecipe = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/api/recipes/${id}`);
  return response.json();
};

const RecipePage = async ({ params, searchParams }: RecipePageProps) => {
  const { id } = await params;
  const { from } = await searchParams;

  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Break out of parent container for full-width hero */}
      <div className="-mx-4 md:mx-0">
        {/* Hero Section with Actions - renders immediately with server data */}
        <div className="relative">
          <RecipeHero recipe={recipe} />
          <BackButton from={from} />
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <RecipeContent recipe={recipe} />
      </div>
    </div>
  );
};

export default RecipePage;
