import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";

const useGetMenu = () => {
  const api = useAxios();
  const { user } = useUser();

  const getMenu = async () => {
    const response = await api.get("/api/menu", {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.MENU],
    queryFn: getMenu,
    enabled: !!user?.accessToken,
  });

  return { menu: data, isLoading, error };
};

export default useGetMenu;
