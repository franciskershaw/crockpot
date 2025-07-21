"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { RecipeFilters } from "@/data/types";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

interface FilterContextType {
  filters: RecipeFilters; // These are now always hydration-safe
  updateFilters: (updates: Partial<RecipeFilters>) => void;
  clearAllFilters: () => void;
  timeRange: { min: number; max: number };
  hasActiveFilters: boolean;
  activeFilterCount: number;
  isHydrated: boolean; // Keep for any edge cases
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

const FILTERS_STORAGE_KEY = "crockpot_recipe_filters";

export default function FilterProvider({
  children,
  timeRange,
}: FilterProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Create default filters
  const getDefaultFilters = useCallback(
    (): RecipeFilters => ({
      approved: true,
      minTime: timeRange.min,
      maxTime: timeRange.max,
      categoryIds: [],
      categoryMode: "include",
      ingredientIds: [],
      query: undefined,
    }),
    [timeRange.min, timeRange.max]
  );

  // Use localStorage to persist filters (this contains the raw localStorage values)
  const [rawFilters, setRawFilters] = useLocalStorageState<RecipeFilters>(
    FILTERS_STORAGE_KEY,
    getDefaultFilters()
  );

  // Mark as hydrated after first client render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Update time range if it has changed (e.g., new recipes added)
  useEffect(() => {
    setRawFilters((prev) => ({
      ...prev,
      minTime:
        prev.minTime === undefined
          ? timeRange.min
          : Math.max(prev.minTime, timeRange.min),
      maxTime:
        prev.maxTime === undefined
          ? timeRange.max
          : Math.min(prev.maxTime, timeRange.max),
    }));
  }, [timeRange.min, timeRange.max, setRawFilters]);

  // Return hydration-safe filters (default values during SSR/initial hydration)
  const filters = useMemo(() => {
    if (!isHydrated) {
      return getDefaultFilters();
    }
    return rawFilters;
  }, [isHydrated, rawFilters, getDefaultFilters]);

  // Calculate active filters and count using hydration-safe filters
  const { hasActiveFilters, activeFilterCount } = useMemo(() => {
    const hasQuery = filters.query && filters.query.trim() !== "";
    const hasCategories = filters.categoryIds && filters.categoryIds.length > 0;
    const hasIngredients =
      filters.ingredientIds && filters.ingredientIds.length > 0;
    const hasTimeRange =
      filters.minTime !== timeRange.min || filters.maxTime !== timeRange.max;

    const hasActiveFilters =
      hasQuery || hasCategories || hasIngredients || hasTimeRange;

    const activeFilterCount =
      (hasQuery ? 1 : 0) +
      (filters.categoryIds?.length || 0) +
      (filters.ingredientIds?.length || 0) +
      (hasTimeRange ? 1 : 0);

    return { hasActiveFilters, activeFilterCount };
  }, [filters, timeRange]);

  const updateFilters = (updates: Partial<RecipeFilters>) => {
    setRawFilters((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const clearAllFilters = () => {
    const defaultFilters = getDefaultFilters();
    setRawFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider
      value={{
        filters, // These are now always hydration-safe
        updateFilters,
        clearAllFilters,
        timeRange,
        hasActiveFilters,
        activeFilterCount,
        isHydrated,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
