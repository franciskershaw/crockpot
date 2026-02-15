import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import { queryKeys } from "@/lib/constants";
import { Item } from "@/shared/types";

const useGetItems = (mode: "all" | "ingredients") => {
  const api = useAxios();

  const getItems = async (): Promise<Item[]> => {
    const response = await api.get("/api/items", { params: { mode } });
    return response.data;
  };

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery<Item[]>({
    queryKey: [queryKeys.ITEMS, mode],
    queryFn: getItems,
  });

  return { items, isLoading, error };
};

export default useGetItems;
