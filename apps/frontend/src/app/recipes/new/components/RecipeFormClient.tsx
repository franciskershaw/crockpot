"use client";

// import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { UserRole } from "@/data/types";
import type { Item, RecipeCategory, Unit } from "@/data/types";
import useUser from "@/hooks/user/useUser";
import { useGetUserRecipeCount } from "@/hooks/useUserRecipes";
import { hasPermission, Permission } from "@/lib/action-helpers";

import type { EditRecipeInput } from "../helpers/recipe-form-helpers";

import CreateRecipeForm from "./CreateRecipeForm";
import CreateRecipeFormSkeleton from "./CreateRecipeFormSkeleton";

interface RecipeFormClientProps {
  recipeCategories: RecipeCategory[];
  ingredients: Item[];
  units: Unit[];
  recipe?: EditRecipeInput; // Optional - if provided, we're editing
  recipeOwnerId?: string; // Required when editing
}

/**
 * Shared client component that handles authentication and permission checks
 * before rendering the recipe form (for both create and edit)
 * Leverages React Query cache for instant rendering on repeat visits
 */
export default function RecipeFormClient({
  recipeCategories,
  ingredients,
  units,
  recipe,
  recipeOwnerId,
}: RecipeFormClientProps) {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const isEditing = !!recipe;
  const { user, fetchingUser } = useUser();
  // Only fetch recipe count when creating (not needed for editing)
  const { recipeCount, isLoading: countLoading } = useGetUserRecipeCount();

  // Client-side auth and permission checks
  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (user && user._id) {
      const userRole = user.role;
      const userId = user._id;

      // Check if user has permission to create/edit recipes
      if (!hasPermission(userRole, Permission.CREATE_RECIPES)) {
        router.push("/your-crockpot");
        return;
      }

      // For editing: check ownership
      if (isEditing && recipeOwnerId) {
        const isOwner = userId === recipeOwnerId;
        const isAdmin = userRole === UserRole.ADMIN;

        if (!isOwner && !isAdmin) {
          router.push("/your-crockpot");
          return;
        }
      }

      // For creating: check recipe limits
      if (!isEditing && recipeCount !== undefined) {
        const hasReachedLimit =
          (userRole === UserRole.FREE && recipeCount >= 5) ||
          (userRole === UserRole.PREMIUM && recipeCount >= 10);

        if (hasReachedLimit) {
          router.push("/your-crockpot");
        }
      }
    }
  }, [router, recipeCount, isEditing, recipeOwnerId, user]);

  // Show skeleton if:
  // 1. Session is still loading, OR
  // 2. Creating AND recipe count is loading AND no cached data exists
  const isInitialLoad =
    fetchingUser || (!isEditing && countLoading && recipeCount === undefined);

  if (isInitialLoad) {
    return <CreateRecipeFormSkeleton />;
  }

  // Render the form once auth and permissions are verified
  return (
    <CreateRecipeForm
      recipe={recipe}
      recipeCategories={recipeCategories}
      ingredients={ingredients}
      units={units}
    />
  );
}
