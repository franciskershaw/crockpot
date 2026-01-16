"use client";

import { Recipe } from "@/data/types";

import AddToMenuButton from "./AddToMenuButton";
import AddToFavouritesButton from "./AddToFavouritesButton";
import { useGetFavourites } from "@/hooks/useFavourites";

export default function RecipeCardActions({ recipe }: { recipe: Recipe }) {
  const { favourites } = useGetFavourites();
  const isFavourited =
    favourites?.some((fav) => fav.id === recipe?.id) ?? false;
  return (
    <div className={`flex items-center justify-between h-8 w-full`}>
      <AddToMenuButton recipe={recipe} />
      <AddToFavouritesButton recipeId={recipe.id} favourited={isFavourited} />
    </div>
  );
}
