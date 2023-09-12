import { useQuery } from "@tanstack/react-query";
import useAxios from "../axios/useAxios";
import { queryKeys } from "@/src/providers/Providers";

const useRecipes = () => {
  const api = useAxios();

  const getRecipes = async () => {
    const response = await api.get("/api/recipes");
    return response.data;
  };

  const { data: allRecipes = [] } = useQuery([queryKeys.recipes], getRecipes);

  return { allRecipes };
};

export default useRecipes;
