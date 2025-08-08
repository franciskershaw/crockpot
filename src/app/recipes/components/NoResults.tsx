"use client";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, ChefHat } from "lucide-react";
import { useFilters } from "../context/FilterProvider";
import EmptyStateWithBackground from "@/components/ui/empty-state";

export default function NoResults() {
  const { hasActiveFilters, activeFilterCount, clearAllFilters } = useFilters();

  if (hasActiveFilters) {
    return (
      <EmptyStateWithBackground>
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">No recipes found</h3>
          <p className="text-gray-600 leading-relaxed">
            We couldn&apos;t find any recipes matching your current filters. Try
            adjusting your search criteria or clearing filters to see more
            options.
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

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={clearAllFilters}
            variant="outline"
            className="w-full border-2 hover:bg-gray-50"
          >
            Clear All Filters
          </Button>
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
      </EmptyStateWithBackground>
    );
  }

  return (
    <EmptyStateWithBackground>
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
          <ChefHat className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Title and Description */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">No recipes yet</h3>
        <p className="text-gray-600 leading-relaxed">
          It looks like there are no recipes in the collection yet. Be the first
          to add one and help build this delicious community!
        </p>
      </div>

      {/* Action Button */}
      <div className="space-y-3 pt-2">
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
    </EmptyStateWithBackground>
  );
}
