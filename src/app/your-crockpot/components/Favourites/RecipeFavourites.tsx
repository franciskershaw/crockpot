"use client";

import RecipeCard from "@/app/recipes/components/RecipeCard";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";
import EmptyState from "@/components/ui/empty-state";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetFavourites } from "@/hooks/useFavourites";

export default function RecipeFavourites() {
  const { favourites } = useGetFavourites();

  return (
    <>
      {!favourites || favourites.length === 0 ? (
        <EmptyState minHeight="min-h-[calc(100vh-20rem)] md:min-h-[calc(100vh-16rem)]">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-pink-100 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              No favourite recipes yet
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Start building your collection of favourite recipes by browsing
              our recipes and clicking the heart icon on recipes you love.
              They&apos;ll appear here for easy access.
            </p>
          </div>

          {/* Action Button */}
          <div className="space-y-3 pt-2">
            <Button
              asChild
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white"
            >
              <Link href="/recipes">
                <Search className="h-4 w-4 mr-2" />
                Browse Recipes
              </Link>
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500">
            Click the heart icon on any recipe to add it to your favourites
          </p>
        </EmptyState>
      ) : (
        <ResponsiveRecipeGrid>
          {favourites.map((recipe, index) => (
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
