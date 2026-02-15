import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

const useGetUserRecipeCount = () => {
  const api = useAxios();
  const { user } = useUser();

  const getUserRecipeCount = async (): Promise<number> => {
    if (!user?._id) return 0;

    const response = await api.get(`/api/recipes`, {
      params: {
        filters: JSON.stringify({
          createdById: user._id,
        }),
        pageSize: 1, // We only need the count, not the actual recipes
      },
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });

    return response.data.total || 0;
  };

  const {
    data: recipeCount = 0,
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKeys.USER_RECIPE_COUNT, user?._id],
    queryFn: getUserRecipeCount,
    enabled: !!user?._id, // Only fetch if user is logged in
  });

  return { recipeCount, isLoading, error };
};

export default useGetUserRecipeCount;
