"use client";

import { useSession } from "next-auth/react";
import { Recipe } from "@/data/types";
import AddToMenuButton from "@/app/recipes/components/AddToMenuButton";
import AddToFavouritesButton from "@/app/recipes/components/AddToFavouritesButton";

interface RecipeDetailActionsProps {
  recipe: Recipe;
}

export default function RecipeDetailActions({
  recipe,
}: RecipeDetailActionsProps) {
  const { data: session, status } = useSession();

  // Don't render anything if user is not authenticated
  if (status === "loading" || !session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <AddToFavouritesButton recipeId={recipe.id} />
      <AddToMenuButton recipe={recipe} />
    </div>
  );
}
