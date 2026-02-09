import { useQuery, useQueryClient } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import { queryKeys } from "@/lib/constants";
import { IUser } from "@/shared/types";

const useUser = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  const getUser = async (): Promise<IUser | null> => {
    try {
      const response = await api.get("/api/auth/refresh-token");
      if (response?.status === 200) {
        const userResponse = await api.get("/api/users", {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        });
        return userResponse.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  const { data: user, isFetching: fetchingUser } = useQuery<IUser | null>({
    queryKey: [queryKeys.USER],
    queryFn: getUser,
    retry: false,
  });

  function updateUser(newUser: IUser) {
    queryClient.setQueryData([queryKeys.USER], newUser);
  }

  async function clearUser() {
    try {
      await api.post("/api/auth/logout");
      queryClient.setQueryData([queryKeys.USER], null);
    } catch (error) {
      console.error(error);
    }
  }

  return { user: user ?? null, fetchingUser, updateUser, clearUser };
};

export default useUser;
