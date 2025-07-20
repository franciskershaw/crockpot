"use client";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import type { RecipeFilters } from "@/data/recipes";

interface FilterContextType {
  filters: RecipeFilters;
  updateFilters: (updates: Partial<RecipeFilters>) => void;
  clearAllFilters: () => void;
  timeRange: { min: number; max: number };
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}

interface FilterProviderProps {
  children: ReactNode;
  timeRange: { min: number; max: number };
}

export default function FilterProvider({
  children,
  timeRange,
}: FilterProviderProps) {
  const [filters, setFilters] = useState<RecipeFilters>({
    approved: true,
    minTime: timeRange.min,
    maxTime: timeRange.max,
    categoryIds: [],
    categoryMode: "include",
    ingredientIds: [],
    query: undefined,
  });

  // Calculate active filters and count
  const { hasActiveFilters, activeFilterCount } = useMemo(() => {
    const hasQuery = filters.query && filters.query.trim() !== "";
    const hasCategories = filters.categoryIds && filters.categoryIds.length > 0;
    const hasIngredients = filters.ingredientIds && filters.ingredientIds.length > 0;
    const hasTimeRange = filters.minTime !== timeRange.min || filters.maxTime !== timeRange.max;

    const hasActiveFilters = hasQuery || hasCategories || hasIngredients || hasTimeRange;

    const activeFilterCount =
      (hasQuery ? 1 : 0) +
      (filters.categoryIds?.length || 0) +
      (filters.ingredientIds?.length || 0) +
      (hasTimeRange ? 1 : 0);

    return { hasActiveFilters, activeFilterCount };
  }, [filters, timeRange]);

  const updateFilters = (updates: Partial<RecipeFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      approved: true,
      minTime: timeRange.min,
      maxTime: timeRange.max,
      categoryIds: [],
      categoryMode: "include",
      ingredientIds: [],
      query: undefined,
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilters,
        clearAllFilters,
        timeRange,
        hasActiveFilters,
        activeFilterCount,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
