"use client";

import AddToFavouritesButton from "@/app/recipes/components/AddToFavouritesButton";
import AddToMenuButton from "@/app/recipes/components/AddToMenuButton";
import { Recipe } from "@/shared/types";

import DeleteRecipeButton from "./DeleteRecipeButton";
import EditRecipeButton from "./EditRecipeButton";

interface RecipeDetailActionsProps {
  recipe: Recipe;
}

export default function RecipeDetailActions({
  recipe,
}: RecipeDetailActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <EditRecipeButton recipe={recipe} />
      <DeleteRecipeButton recipe={recipe} />
      <AddToFavouritesButton recipeId={recipe._id} />
      <AddToMenuButton recipe={recipe} />
    </div>
  );
}
