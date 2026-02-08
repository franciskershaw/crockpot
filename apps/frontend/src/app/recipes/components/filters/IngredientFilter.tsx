"use client";

import { useFilters } from "@/app/recipes/context/FilterProvider";

import GenericFilterList from "./GenericFilterList";

export default function IngredientFilter() {
  const { filters, updateFilters } = useFilters();
  const selectedIngredientIds = filters.ingredientIds || [];

  const handleIngredientChange = (id: string, checked: boolean) => {
    const newIngredientIds = checked
      ? [...selectedIngredientIds, id]
      : selectedIngredientIds.filter((iid) => iid !== id);
    updateFilters({ ingredientIds: newIngredientIds });
  };

  return (
    <GenericFilterList
      label="Ingredients"
      // options={ingredients}
      options={[]}
      selectedIds={selectedIngredientIds}
      onChange={handleIngredientChange}
      id="ingredient-filter"
    />
  );
}
