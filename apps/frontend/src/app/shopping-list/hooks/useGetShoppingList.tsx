import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useGetItems from "@/app/items/hooks/useGetItems";
import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import { queryKeys } from "@/lib/constants";
import { WATER_ITEM_ID } from "@/shared/constants";
import type { Item } from "@/shared/types";

const useGetShoppingList = () => {
  const api = useAxios();
  const { user } = useUser();
  const { items } = useGetItems("all");

  const getShoppingList = async () => {
    const response = await api.get("/api/shopping-list", {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return response.data;
  };

  const {
    data: shoppingList,
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKeys.SHOPPING_LIST],
    queryFn: getShoppingList,
    enabled: !!user?.accessToken,
  });

  const { grouped, categories } = useMemo(() => {
    const itemsById = new Map<string, Item>(
      (items ?? []).map((it: Item) => [it._id, it])
    );
    const reduced = (shoppingList?.items ?? []).reduce(
      (acc, listItem) => {
        // Skip water items
        if (listItem.itemId === WATER_ITEM_ID) return acc;

        const itemRecord = listItem.item ?? itemsById.get(listItem.itemId);
        const category = itemRecord?.categoryId;
        if (!category) return acc; // skip until relations load; prevents crashes

        const displayItem = {
          ...listItem,
          displayLabel: itemRecord?.name ?? "",
          displayUnitAbbr: listItem.unit?.abbreviation ?? "",
        };

        acc.groupedByCategory[category._id] = [
          ...(acc.groupedByCategory[category._id] ?? []),
          displayItem,
        ];

        if (!acc.categoriesById[category._id]) {
          acc.categoriesById[category._id] = {
            _id: category._id,
            name: category.name,
            faIcon: category.faIcon,
          };
        }

        return acc;
      },
      {
        groupedByCategory: {} as Record<string, DisplayItem[]>,
        categoriesById: {} as Record<
          string,
          { _id: string; name: string; faIcon: string }
        >,
      }
    );

    return {
      grouped: reduced.groupedByCategory,
      categories: reduced.categoriesById,
    };
  }, [shoppingList, items]);

  const categoryIds = Object.keys(categories).sort((a, b) =>
    a.localeCompare(b)
  );

  return {
    shoppingList,
    isLoading,
    error,
    grouped,
    categories,
    categoryIds,
  };
};

export default useGetShoppingList;
