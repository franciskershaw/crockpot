"use client";

import { Recipe } from "@/data/types";
import { Session } from "next-auth";
import AddToMenuButton from "@/app/recipes/components/AddToMenuButton";
import AddToFavouritesButton from "@/app/recipes/components/AddToFavouritesButton";
import EditRecipeButton from "./EditRecipeButton";
import DeleteRecipeButton from "./DeleteRecipeButton";
import { useGetFavourites } from "@/hooks/useFavourites";

interface RecipeDetailActionsProps {
  recipe: Recipe;
  session: Session;
}

export default function RecipeDetailActions({
  recipe,
  session,
}: RecipeDetailActionsProps) {
  const { favourites } = useGetFavourites();
  const isFavourited = favourites?.some((fav) => fav.id === recipe.id);
  return (
    <div className="flex items-center gap-2">
      <EditRecipeButton recipe={recipe} user={session.user} />
      <DeleteRecipeButton recipe={recipe} user={session.user} />
      <AddToFavouritesButton recipeId={recipe.id} favourited={isFavourited} />
      <AddToMenuButton recipe={recipe} />
    </div>
  );
}
