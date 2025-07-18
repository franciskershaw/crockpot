"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { RecipeFilters } from "@/data/recipes";

interface TimeRange {
  min: number;
  max: number;
}

interface FilterContextType {
  filters: RecipeFilters;
  timeRange: TimeRange;
  updateFilters: (updates: Partial<RecipeFilters>) => void;
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
  timeRange: TimeRange;
}

export default function FilterProvider({ children, timeRange }: FilterProviderProps) {
  const [filters, setFilters] = useState<RecipeFilters>({
    approved: true,
    minTime: timeRange.min,
    maxTime: timeRange.max,
  });

  const updateFilters = (updates: Partial<RecipeFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        timeRange,
        updateFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
} 