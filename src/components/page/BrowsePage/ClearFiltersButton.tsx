"use client";
import { Button } from "@/components/ui/button";
import { useFilters } from "./FilterProvider";

export default function ClearFiltersButton() {
  const { filters, clearAllFilters } = useFilters();

  // Count active filters
  const activeFilterCount = 
    (filters.categoryIds?.length || 0) +
    (filters.ingredientIds?.length || 0) +
    (filters.query && filters.query.trim() !== "" ? 1 : 0);

  if (activeFilterCount === 0) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={clearAllFilters}
      className="h-auto p-0 text-xs text-brand-primary hover:text-brand-tertiary"
    >
      Clear All ({activeFilterCount})
    </Button>
  );
} 