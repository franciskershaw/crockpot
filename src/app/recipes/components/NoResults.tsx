"use client";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, ChefHat } from "lucide-react";
import { useFilters } from "../context/FilterProvider";
import { useQuery } from "@tanstack/react-query";
import { getRandomRecipes } from "@/actions";
import Image from "next/image";
import type { Recipe } from "@/data/types";

export default function NoResults() {
  const { hasActiveFilters, activeFilterCount, clearAllFilters } = useFilters();

  // Fetch random recipes for background
  const { data: backgroundRecipes = [] } = useQuery({
    queryKey: ["randomRecipes", 12],
    queryFn: () => getRandomRecipes(12),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="relative col-span-full">
      {/* Background grid of faded recipe cards */}
      <div className="absolute inset-0 grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 opacity-10 pointer-events-none">
        {backgroundRecipes.map((recipe: Recipe, index) => (
          <div
            key={`${recipe.id}-${index}`}
            className="bg-white rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative h-48 bg-gray-200">
              {recipe.image?.url ? (
                <Image
                  src={recipe.image.url}
                  alt={recipe.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ChefHat className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">{recipe.name}</h3>
              <p className="text-sm text-gray-600">
                {recipe.timeInMinutes} mins
              </p>
            </div>
          </div>
        ))}

        {/* Fill remaining slots if we have fewer recipes */}
        {Array.from({ length: Math.max(0, 12 - backgroundRecipes.length) }).map(
          (_, index) => (
            <div
              key={`placeholder-${index}`}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                <ChefHat className="h-16 w-16 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Overlay content */}
      <div className="relative z-10 flex items-center justify-center min-h-[600px]">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
              {hasActiveFilters ? (
                <Search className="h-8 w-8 text-blue-600" />
              ) : (
                <ChefHat className="h-8 w-8 text-blue-600" />
              )}
            </div>
          </div>

          {/* Title and Description */}
          {hasActiveFilters ? (
            <>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  No recipes found
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We couldn&apos;t find any recipes matching your current
                  filters. Try adjusting your search criteria or clearing
                  filters to see more options.
                </p>
              </div>

              {/* Active Filters Info */}
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <Filter className="h-4 w-4" />
                <span>
                  {activeFilterCount} active filter
                  {activeFilterCount !== 1 ? "s" : ""}
                </span>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                No recipes yet
              </h3>
              <p className="text-gray-600 leading-relaxed">
                It looks like there are no recipes in the collection yet. Be the
                first to add one and help build this delicious community!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {hasActiveFilters && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="w-full border-2 hover:bg-gray-50"
              >
                Clear All Filters
              </Button>
            )}

            <Button
              disabled
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recipe
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500">Recipe submission coming soon</p>
        </div>
      </div>
    </div>
  );
}
