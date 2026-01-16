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
  hasActiveFilters: boolean;
  activeFilterCount: number;
  isHydrated: boolean; // Keep for any edge cases
  totalRecipeCount: number;
  setTotalRecipeCount: (count: number) => void;
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
}

const FILTERS_STORAGE_KEY = "crockpot_recipe_filters";

export default function FilterProvider({ children }: FilterProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [totalRecipeCount, setTotalRecipeCount] = useState(0);

  // Create default filters
  const getDefaultFilters = useCallback(
    (): RecipeFilters => ({
      approved: true,
      minTime: undefined,
      maxTime: undefined,
      categoryIds: [],
      categoryMode: "include",
      ingredientIds: [],
      query: undefined,
    }),
    []
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
      filters.minTime !== undefined || filters.maxTime !== undefined;

    const hasActiveFilters =
      hasQuery || hasCategories || hasIngredients || hasTimeRange;

    const activeFilterCount =
      (hasQuery ? 1 : 0) +
      (filters.categoryIds?.length || 0) +
      (filters.ingredientIds?.length || 0) +
      (hasTimeRange ? 1 : 0);

    return { hasActiveFilters, activeFilterCount };
  }, [filters]);

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
        filters,
        updateFilters,
        clearAllFilters,
        hasActiveFilters,
        activeFilterCount,
        isHydrated,
        totalRecipeCount,
        setTotalRecipeCount,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
