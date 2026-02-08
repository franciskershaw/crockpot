"use client";

import { useFilters } from "@/app/recipes/context/FilterProvider";

import useGetRecipeCategories from "../../hooks/useGetRecipeCategories";

import GenericFilterList from "./GenericFilterList";

export default function CategoryFilter() {
  const { filters, updateFilters } = useFilters();
  const selectedCategoryIds = filters.categoryIds || [];
  const categoryMode = filters.categoryMode || "include";

  const { data: categories, isLoading } = useGetRecipeCategories();

  const handleCategoryChange = (id: string, checked: boolean) => {
    const newCategoryIds = checked
      ? [...selectedCategoryIds, id]
      : selectedCategoryIds.filter((cid) => cid !== id);
    updateFilters({ categoryIds: newCategoryIds });
  };

  const handleModeChange = (mode: "include" | "exclude") => {
    updateFilters({ categoryMode: mode });
  };

  return (
    <GenericFilterList
      label="Categories"
      options={categories || []}
      selectedIds={selectedCategoryIds}
      onChange={handleCategoryChange}
      showIncludeExclude={true}
      includeExcludeValue={categoryMode}
      onIncludeExcludeChange={handleModeChange}
      id="category-filter"
      isLoading={isLoading}
    />
  );
}
