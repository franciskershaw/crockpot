"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import SearchBar from "./SearchBar";
import RecipeCountBadge from "./RecipeCountBadge";
import MobileFilterSidebar from "./MobileFilterSidebar";
import ClearFiltersButton from "./ClearFiltersButton";
import ActiveFilterBadges from "./ActiveFilterBadges";
import type { RecipeCategory, Item } from "@/data/types";

interface BrowseHeaderProps {
  categories: RecipeCategory[];
  timeRange: { min: number; max: number };
  ingredients: Item[];
}

const BrowseHeader = ({
  categories,
  timeRange,
  ingredients,
}: BrowseHeaderProps) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <>
      <div className="sticky top-16 z-40 bg-surface-warm/95 backdrop-blur-sm py-4 my-2">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Browse Recipes</h1>
            <div className="flex items-center gap-2">
              <ClearFiltersButton />
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
        <div className="hidden md:flex md:items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <h1 className="text-3xl font-bold whitespace-nowrap">
              Browse Recipes
            </h1>
            <RecipeCountBadge />
          </div>
          <div className="flex-1 min-w-0">
            <ActiveFilterBadges
              categories={categories}
              ingredients={ingredients}
            />
          </div>
          <div className="shrink-0 w-full max-w-md md:max-w-sm">
            <SearchBar />
          </div>
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
