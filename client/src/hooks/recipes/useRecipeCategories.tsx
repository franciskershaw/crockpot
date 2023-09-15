import { useQuery } from "@tanstack/react-query";
import useAxios from "../axios/useAxios";
import { queryKeys } from "@/src/providers/Providers";

const useRecipeCategories = () => {
  const api = useAxios();

  const getRecipeCategories = async () => {
    const response = await api.get("/api/recipeCategories");
    return response.data;
  };

  const { data: recipeCategories = [] } = useQuery(
    [queryKeys.recipeCategories],
    getRecipeCategories
  );

  return { recipeCategories };
};

export default useRecipeCategories;
