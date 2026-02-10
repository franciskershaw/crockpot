"use client";

import useGetFavourites from "@/app/favourites/hooks/useGetFavourites";
import { Recipe } from "@/shared/types";

import AddToFavouritesButton from "./AddToFavouritesButton";
import AddToMenuButton from "./AddToMenuButton";

// import { useGetFavourites } from "@/hooks/useFavourites";

export default function RecipeCardActions({ recipe }: { recipe: Recipe }) {
  const { favourites } = useGetFavourites();
  const isFavourited =
    favourites?.some((fav: Recipe) => fav._id === recipe?._id) ?? false;

  return (
    <div className={`flex items-center justify-between h-8 w-full`}>
      <AddToMenuButton recipe={recipe} />
      <AddToFavouritesButton recipeId={recipe._id} favourited={isFavourited} />
    </div>
  );
}
