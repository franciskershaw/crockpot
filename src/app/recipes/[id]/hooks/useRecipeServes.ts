"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useGetMenu } from "@/hooks/useMenu";
import { scaleIngredients, type Ingredient } from "../helpers/helpers";

interface UseRecipeServesProps {
  recipeId: string;
  originalServes: number;
  ingredients: Ingredient[];
}

export function useRecipeServes({
  recipeId,
  originalServes,
  ingredients,
}: UseRecipeServesProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const { menu } = useGetMenu();

  // For non-authenticated users, manage serves locally
  const [localServes, setLocalServes] = useState(originalServes);

  // For logged-in users, get serves from menu if recipe is added
  const menuEntry = menu?.entries?.find((entry) => entry.recipeId === recipeId);
  const menuServes = menuEntry?.serves;

  // Determine which serves value to use:
  // - For authenticated users: use menuServes if available, otherwise original
  // - For non-authenticated users: use local state
  const effectiveServes = isAuthenticated
    ? menuServes ?? originalServes
    : localServes;

  // Scale ingredients based on effective serves
  const scaledIngredients = useMemo(
    () => scaleIngredients(ingredients, originalServes, effectiveServes),
    [ingredients, originalServes, effectiveServes]
  );

  // Handle serves adjustment for non-authenticated users only
  const adjustServes = (delta: number) => {
    if (!isAuthenticated) {
      const newServes = Math.max(1, Math.min(20, localServes + delta));
      setLocalServes(newServes);
    }
  };

  return {
    isAuthenticated,
    effectiveServes,
    scaledIngredients,
    adjustServes,
    canAdjustServes: !isAuthenticated,
  };
}
