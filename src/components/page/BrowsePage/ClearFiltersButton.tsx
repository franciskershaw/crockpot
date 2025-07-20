"use client";
import { Button } from "@/components/ui/button";
import { useFilters } from "./FilterProvider";

export default function ClearFiltersButton() {
  const { hasActiveFilters, activeFilterCount, clearAllFilters } = useFilters();

  if (!hasActiveFilters) {
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