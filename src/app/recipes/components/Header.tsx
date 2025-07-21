"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import SearchBar from "./SearchBar";
import RecipeCountBadge from "./RecipeCountBadge";
import MobileFilterSidebar from "./MobileFilterSidebar";
import ClearFiltersButton from "./ClearFiltersButton";
import { useFilters } from "../context/FilterProvider";
import type { RecipeCategory, Item } from "@/data/types";

interface BrowseHeaderProps {
  categories: RecipeCategory[];
  timeRange: { min: number; max: number };
  ingredients: Item[];
}

const BrowseHeader = ({ categories, timeRange, ingredients }: BrowseHeaderProps) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { hasActiveFilters } = useFilters();

  return (
    <>
      <div className="sticky top-16 z-40 bg-surface-warm/95 backdrop-blur-sm py-4">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Browse Recipes</h1>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <ClearFiltersButton />
              )}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
                aria-label="Open filters"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
          <RecipeCountBadge />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
              Browse Recipes
            </h1>
            <RecipeCountBadge />
          </div>
          <SearchBar />
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <MobileFilterSidebar
        categories={categories}
        timeRange={timeRange}
        ingredients={ingredients}
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />
    </>
  );
};

export default BrowseHeader;
