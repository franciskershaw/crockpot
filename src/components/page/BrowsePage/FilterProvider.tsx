"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { RecipeFilters } from "@/data/recipes";

interface FilterContextType {
  filters: RecipeFilters;
  updateFilters: (updates: Partial<RecipeFilters>) => void;
  clearAllFilters: () => void;
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
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
