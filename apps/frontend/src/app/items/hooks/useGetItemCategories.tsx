import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import { queryKeys } from "@/lib/constants";
import type { ItemCategory } from "@/shared/types";

const useGetItemCategories = () => {
  const api = useAxios();

  const getItemCategories = async (): Promise<ItemCategory[]> => {
    const response = await api.get("/api/items/categories");
    return response.data;
  };

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKeys.ITEMS, "categories"],
    queryFn: getItemCategories,
  });

  return { categories, isLoading, error };
};

export default useGetItemCategories;
