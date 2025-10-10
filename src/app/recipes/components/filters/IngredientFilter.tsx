"use client";
import { useFilters } from "@/app/recipes/context/FilterProvider";
import type { Item } from "@/data/types";
import GenericFilterList from "./GenericFilterList";

export default function IngredientFilter({
  ingredients = [],
  id,
}: {
  ingredients: Item[];
  id?: string;
}) {
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
      options={ingredients}
      selectedIds={selectedIngredientIds}
      onChange={handleIngredientChange}
      id={id}
    />
  );
}
