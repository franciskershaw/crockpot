"use client";

import { Recipe } from "@/data/types";
import { Session } from "next-auth";
import AddToMenuButton from "@/app/recipes/components/AddToMenuButton";
import AddToFavouritesButton from "@/app/recipes/components/AddToFavouritesButton";
import EditRecipeButton from "./EditRecipeButton";
import DeleteRecipeButton from "./DeleteRecipeButton";

interface RecipeDetailActionsProps {
  recipe: Recipe;
  session: Session | null;
}

export default function RecipeDetailActions({
  recipe,
  session,
}: RecipeDetailActionsProps) {
  // Don't render anything if user is not authenticated
  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <EditRecipeButton recipe={recipe} user={session.user} />
      <DeleteRecipeButton recipe={recipe} user={session.user} />
      <AddToFavouritesButton recipeId={recipe.id} />
      <AddToMenuButton recipe={recipe} />
    </div>
  );
}
