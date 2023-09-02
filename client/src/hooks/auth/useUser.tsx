import useAxios from "../axios/useAxios";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/src/providers/Providers";
import { User } from "@/src/types/types";

const useUser = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  const getUser = async () => {
    const response = await api.get("/api/users/refreshToken");
    if (response.status === 200) {
      const user = await api.get("/api/users", {
        headers: {
          Authorization: `Bearer ${response.data.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return user.data;
    }
  };

  const { data: user, isFetching: fetchingUser } = useQuery(
    [queryKeys.user],
    () => getUser()
  );

  function updateUser(newUser: User) {
    queryClient.setQueryData([queryKeys.user], newUser);
  }

  async function clearUser() {
    try {
      const response = await api.post("/api/users/logout");
      queryClient.setQueryData([queryKeys.user], null);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  return { user: user ?? null, fetchingUser, updateUser, clearUser };
};

export default useUser;
