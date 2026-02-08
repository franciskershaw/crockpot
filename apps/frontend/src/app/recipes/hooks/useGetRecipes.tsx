import { useMemo } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { RecipeFilters } from "@/data/types";
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

const useGetRecipes = (pageSize: number) => {
  const api = useAxios();
  const { filters } = useFilters();
  const sessionSeed = useSessionSeed();

  const queryKey = useMemo(
    () => createRecipeQueryKey(pageSize, filters, sessionSeed),
    [filters, pageSize, sessionSeed]
  );

  const getRecipes = async (params: GetRecipesParams) => {
    const response = await api.get("/api/recipes", { params });
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

  return {
    data,
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
