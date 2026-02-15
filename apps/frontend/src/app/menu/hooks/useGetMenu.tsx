import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";
import { RecipeMenu } from "@/shared/types";

const useGetMenu = () => {
  const api = useAxios();
  const { user } = useUser();

  const getMenu = async (): Promise<RecipeMenu> => {
    const response = await api.get("/api/menu", {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  const { data, isLoading, error } = useQuery<RecipeMenu>({
    queryKey: [queryKeys.MENU],
    queryFn: getMenu,
    enabled: !!user?.accessToken,
  });

  return { menu: data, isLoading, error };
};

export default useGetMenu;
