"use server";

import { getRecipeTimeRange, getRecipeCategories } from "@/actions/recipes";
import { getIngredients } from "@/actions/items";
import BrowseHeader from "./components/Header";
import RecipeGrid from "./components/RecipeGrid";
import Filters from "./components/Filters";
import FilterProvider from "./context/FilterProvider";
import ServerSideSkeletons from "./components/ServerSideSkeletons";

export default async function Recipes() {
  // Fetch the data needed for filters and UI setup
  const [timeRange, categories, ingredients] = await Promise.all([
    getRecipeTimeRange(),
    getRecipeCategories(),
    getIngredients(),
  ]);

  return (
    <FilterProvider timeRange={timeRange}>
      <BrowseHeader
        categories={categories}
        timeRange={timeRange}
        ingredients={ingredients}
      />
      <div className="flex gap-6">
        {/* Desktop Filters - Hidden on mobile */}
        <div className="hidden md:block w-80">
          <Filters />
        </div>
        <div className="flex-1 relative">
          <ServerSideSkeletons pageSize={9} />
          <RecipeGrid pageSize={9} />
        </div>
      </div>
    </FilterProvider>
  );
}
