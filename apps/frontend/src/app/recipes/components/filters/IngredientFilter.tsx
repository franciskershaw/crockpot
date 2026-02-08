"use client";

import useItems from "@/app/items/useItems";
import { useFilters } from "@/app/recipes/context/FilterProvider";

import GenericFilterList from "./GenericFilterList";

export default function IngredientFilter() {
  const { filters, updateFilters } = useFilters();
  const selectedIngredientIds = filters.ingredientIds || [];

  const { data: ingredients, isLoading } = useItems("ingredients");

  const handleIngredientChange = (id: string, checked: boolean) => {
    const newIngredientIds = checked
      ? [...selectedIngredientIds, id]
      : selectedIngredientIds.filter((iid) => iid !== id);
    updateFilters({ ingredientIds: newIngredientIds });
  };

  return (
    <GenericFilterList
      label="Ingredients"
      options={ingredients || []}
      selectedIds={selectedIngredientIds}
      onChange={handleIngredientChange}
      id="ingredient-filter"
      isLoading={isLoading}
    />
  );
}
