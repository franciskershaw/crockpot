"use client";

import useGetItems from "@/app/items/hooks/useGetItems";
import { Card, CardContent } from "@/components/ui/card";

import useGetRecipeCategories from "../hooks/useGetRecipeCategories";
import useGetTimeRange from "../hooks/useGetTimeRange";

import CategoryFilter from "./filters/CategoryFilter";
import IngredientFilter from "./filters/IngredientFilter";
import TimeRangeFilter from "./filters/TimeRangeFilter";
import ClearFiltersButton from "./ClearFiltersButton";
import FiltersSkeleton from "./FiltersSkeleton";

function FiltersContent() {
  return (
    <Card
      className="border-0 sticky top-36 bg-white/80 backdrop-blur-sm shadow-lg overflow-auto p-0"
      style={{ maxHeight: "calc(100vh - 9rem)" }}
    >
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Recipe Filters
            </h2>
            <ClearFiltersButton />
          </div>
          <TimeRangeFilter />
          <CategoryFilter />
          <IngredientFilter />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Filters() {
  const { isLoading: timeRangeLoading } = useGetTimeRange();
  const { isLoading: categoriesLoading } = useGetRecipeCategories();
  const { isLoading: ingredientsLoading } = useGetItems("ingredients");

  const isAnyLoading =
    timeRangeLoading || categoriesLoading || ingredientsLoading;

  if (isAnyLoading) {
    return <FiltersSkeleton />;
  }

  return <FiltersContent />;
}
