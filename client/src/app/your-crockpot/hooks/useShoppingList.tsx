import { useQuery } from "@tanstack/react-query";
import useAxios from "@/src/hooks/axios/useAxios";
import { queryKeys } from "@/src/providers/Providers";
import useUser from "@/src/hooks/auth/useUser";
import { createConfig } from "@/src/helper";

const useShoppingList = () => {
  const api = useAxios();
  const { user } = useUser();

  const getShoppingList = async () => {
    const config = createConfig(user);
    const response = await api.get("/api/users/shoppingList", config);
    return response.data;
  };

  const { data: shoppingList = [] } = useQuery(
    [queryKeys.shoppingList],
    getShoppingList
  );

  return { shoppingList };
};

export default useShoppingList;
