import { useMemo } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { Recipe, RecipeFilters } from "@/data/types";
import useAxios from "@/hooks/axios/useAxios";
import { useSessionSeed } from "@/hooks/useSessionSeed";
import {
  createInfiniteQueryConfig,
  createRecipeQueryKey,
} from "@/lib/query-utils";

import { useFilters } from "../context/FilterProvider";

export interface GetRecipesParams {
  page?: number;
  pageSize?: number;
  filters?: RecipeFilters;
  seed?: number;
}

interface RecipePage {
  recipes: Recipe[];
  total?: number;
  page: number;
  totalPages: number;
}

const useGetRecipes = (pageSize: number) => {
  const api = useAxios();
  const { filters } = useFilters();
  const sessionSeed = useSessionSeed();

  const queryKey = useMemo(
    () => createRecipeQueryKey(pageSize, filters, sessionSeed),
    [filters, pageSize, sessionSeed]
  );

  const getRecipes = async (params: GetRecipesParams) => {
    const { page, pageSize, filters, seed } = params;
    const response = await api.get("/api/recipes", {
      params: {
        page,
        pageSize,
        seed,
        filters: JSON.stringify(filters ?? {}),
      },
    });
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetched,
    refetch,
  } = useInfiniteQuery({
    ...createInfiniteQueryConfig(queryKey, ({ pageParam }) =>
      getRecipes({
        page: pageParam,
        pageSize,
        filters,
        seed: sessionSeed,
      })
    ),
  });

  const recipes = useMemo(
    () => data?.pages?.flatMap((p: RecipePage) => p.recipes) ?? [],
    [data?.pages]
  );

  return {
    data,
    recipes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetched,
    refetch,
    queryKey,
  };
};

export default useGetRecipes;
