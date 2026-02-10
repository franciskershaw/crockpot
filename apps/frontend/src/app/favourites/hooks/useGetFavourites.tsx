import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

const useGetFavourites = () => {
  const api = useAxios();
  const { user, isAuthenticated } = useUser();

  const getFavourites = async () => {
    const response = await api.get("/api/users/favourites", {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.FAVOURITES],
    queryFn: getFavourites,
    enabled: isAuthenticated,
  });

  return {
    favourites: data,
    isLoading,
  };
};

export default useGetFavourites;
