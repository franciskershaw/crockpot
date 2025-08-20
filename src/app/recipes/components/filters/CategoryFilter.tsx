"use client";
import { useFilters } from "@/app/recipes/context/FilterProvider";
import type { RecipeCategory } from "@/data/types";
import GenericFilterList from "./GenericFilterList";

export default function CategoryFilter({
  categories = [],
}: {
  categories: RecipeCategory[];
}) {
  const { filters, updateFilters } = useFilters();
  const selectedCategoryIds = filters.categoryIds || [];
  const categoryMode = filters.categoryMode || "include";

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
      options={categories}
      selectedIds={selectedCategoryIds}
      onChange={handleCategoryChange}
      showIncludeExclude={true}
      includeExcludeValue={categoryMode}
      onIncludeExcludeChange={handleModeChange}
    />
  );
}
