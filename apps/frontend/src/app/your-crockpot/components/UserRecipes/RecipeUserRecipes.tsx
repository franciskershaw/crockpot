"use client";

import RecipeCard from "@/app/recipes/components/RecipeCard";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";
import EmptyState from "@/components/ui/empty-state";
import { ChefHat, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserRecipes } from "@/hooks/useUserRecipes";
import Link from "next/link";

export default function RecipeUserRecipes() {
  const { userRecipes } = useGetUserRecipes();

  return (
    <>
      {!userRecipes || userRecipes.length === 0 ? (
        <EmptyState minHeight="min-h-[calc(100vh-20rem)] md:min-h-[calc(100vh-16rem)]">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
              <ChefHat className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              No recipes created yet
            </h3>
            <p className="text-gray-600 leading-relaxed">
              You haven&apos;t created any recipes yet. Start sharing your
              culinary creations with the community by adding your own recipes
              to the collection.
            </p>
          </div>

          {/* Action Button */}
          <div className="space-y-3 pt-2">
            <Link href="/recipes/new" className="w-full">
              <Button className="w-full bg-brand-primary hover:bg-brand-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus className="h-4 w-4 mr-2" />
                Create Recipe
              </Button>
            </Link>
          </div>
        </EmptyState>
      ) : (
        <ResponsiveRecipeGrid>
          {userRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              priority={index < 6}
              fromPage="/your-crockpot"
            />
          ))}
        </ResponsiveRecipeGrid>
      )}
    </>
  );
}
