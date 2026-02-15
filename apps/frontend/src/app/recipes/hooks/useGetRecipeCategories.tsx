import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import { queryKeys } from "@/lib/constants";

const useGetRecipeCategories = () => {
  const api = useAxios();

  const getRecipeCategories = async () => {
    const response = await api.get("/api/recipes/categories");
    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.RECIPE_CATEGORIES],
    queryFn: getRecipeCategories,
  });

  return { categories: data, isLoading };
};

export default useGetRecipeCategories;
