import { useQuery } from "@tanstack/react-query";
import useAxios from "@/src/hooks/axios/useAxios";
import { queryKeys } from "@/src/providers/Providers";
import useUser from "@/src/hooks/auth/useUser";

const useRecipeMenu = () => {
  const api = useAxios();
  const { user } = useUser();

  const config = {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  };

  const getRecipeMenu = async () => {
    const response = await api.get(`/api/users/recipeMenu`, config);
    return response.data;
  };

  const { data: recipeMenu = [] } = useQuery(
    [queryKeys.recipeMenu],
    getRecipeMenu
  );

  return { recipeMenu };
};

export default useRecipeMenu;
