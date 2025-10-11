"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasPermission, Permission } from "@/lib/action-helpers";
import { useGetUserRecipeCount } from "@/hooks/useUserRecipes";
import { UserRole } from "@/data/types";
import type { Item, RecipeCategory, Unit } from "@/data/types";
import CreateRecipeForm from "./CreateRecipeForm";
import CreateRecipeFormSkeleton from "./CreateRecipeFormSkeleton";

interface CreateRecipeFormClientProps {
  recipeCategories: RecipeCategory[];
  ingredients: Item[];
  units: Unit[];
}

/**
 * Client component that handles authentication and permission checks
 * before rendering the recipe creation form
 * Leverages React Query cache for instant rendering on repeat visits
 */
export default function CreateRecipeFormClient({
  recipeCategories,
  ingredients,
  units,
}: CreateRecipeFormClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { recipeCount, isLoading: countLoading } = useGetUserRecipeCount();

  // Client-side auth and permission checks
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      const userRole = session.user.role;

      // Check if user has permission to create recipes
      if (!hasPermission(userRole, Permission.CREATE_RECIPES)) {
        router.push("/your-crockpot");
        return;
      }

      // Check recipe limits once count is loaded
      if (recipeCount !== undefined) {
        const hasReachedLimit =
          (userRole === UserRole.FREE && recipeCount >= 5) ||
          (userRole === UserRole.PREMIUM && recipeCount >= 10);

        if (hasReachedLimit) {
          router.push("/your-crockpot");
        }
      }
    }
  }, [status, session, router, recipeCount]);

  // Show skeleton if:
  // 1. Session is still loading (queries can't start yet), OR
  // 2. Recipe count is loading AND no cached data exists
  const isInitialLoad =
    status === "loading" || (countLoading && recipeCount === undefined);

  if (isInitialLoad) {
    return <CreateRecipeFormSkeleton />;
  }

  // Render the actual form once auth and limits are verified
  return (
    <CreateRecipeForm
      recipeCategories={recipeCategories}
      ingredients={ingredients}
      units={units}
    />
  );
}
