import { useQuery } from "@tanstack/react-query";
import useAxios from "../axios/useAxios";
import { queryKeys } from "@/src/providers/Providers";
import { Item } from "@/src/types/types";

const householdCategoryId = "6310a881b61a0ace3a1281ec";

const useItems = () => {
  const api = useAxios();

  const getItems = async () => {
    const response = await api.get("/api/items");
    return response.data;
  };

  const { data: allItems = [] } = useQuery([queryKeys.items], getItems);

  // Filter out household items for when adding recipes
  const ingredients = allItems.filter(
    (item: Item) => item.category !== householdCategoryId
  );

  return { allItems, ingredients };
};

export default useItems;
