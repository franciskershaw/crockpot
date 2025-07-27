"use client";

import { Recipe } from "@/data/types";

import AddToMenuButton from "./AddToMenuButton";
import AddToFavouritesButton from "./AddToFavouritesButton";

export default function RecipeCardActions({ recipe }: { recipe: Recipe }) {
  return (
    <div className={`flex items-center justify-between h-8 w-full`}>
      <AddToMenuButton recipe={recipe} />
      <AddToFavouritesButton />
    </div>
  );
}
