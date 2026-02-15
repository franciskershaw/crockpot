import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import { Item } from "@/shared/types";

const useItems = (mode: "all" | "ingredients") => {
  const api = useAxios();

  const getItems = async () => {
    const response = await api.get("/api/items", { params: { mode } });
    return response.data;
  };
  const {
    data: items,
    isLoading,
    error,
  } = useQuery<Item[]>({
    queryKey: ["items", mode],
    queryFn: getItems,
  });

  return { items, isLoading, error };
};

export default useItems;
