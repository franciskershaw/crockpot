import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '@/src/hooks/axios/useAxios';
import { queryKeys } from '@/src/providers/Providers';
import useUser from '@/src/hooks/auth/useUser';
import { createConfig, combineArrays } from '@/src/helper';
import useItemCategories from '@/src/hooks/items/useItemCategories';
import {
	ItemCategory,
	ShoppingListItem,
	GroupedShoppingList,
	User,
	ShoppingItem,
} from '@/src/types/types';
import useExtraItems from './useExtraItems';
import { useMemo } from 'react';

type ToggleVariables = {
	itemId: string;
	obtained: boolean;
	isExtra: boolean;
};

const useShoppingList = () => {
	const queryClient = useQueryClient();
	const api = useAxios();
	const { user } = useUser();
	const { extraItems } = useExtraItems();

	const { itemCategories } = useItemCategories();

	// Requests
	const getShoppingListReq = async () => {
		const config = createConfig(user);
		const response = await api.get('/api/users/shoppingList', config);
		return response.data;
	};

	const toggleItemObtainedReq = async ({
		itemId,
		obtained,
		isExtra,
	}: ToggleVariables) => {
		const config = createConfig(user);
		if (isExtra) {
			let extra;
			let shopping;
			extra = await api.put(
				`/api/users/extraitems/${itemId}`,
				{ obtained },
				config,
			);

			const alsoInShoppingList = shoppingList?.find(
				(item: ShoppingListItem) => item.item._id === itemId,
			);
			if (alsoInShoppingList) {
				shopping = await api.put(
					`/api/users/shoppingList/${itemId}`,
					{ obtained },
					config,
				);
				return { extra: extra.data, shopping: shopping.data };
			}
			if (extra) return { extra: extra.data };
		} else {
			const response = await api.put(
				`/api/users/shoppingList/${itemId}`,
				{ obtained },
				config,
			);
			return { shopping: response.data };
		}
		return null;
	};

	// useQuery hooks
	const { data: shoppingList = [] } = useQuery(
		[queryKeys.shoppingList],
		getShoppingListReq,
	);

	// useMutation hook
	const { mutate: toggleObtained } = useMutation(
		(variables: ToggleVariables) => toggleItemObtainedReq(variables),
		{
			onSuccess: (data) => {
				queryClient.setQueryData(
					[queryKeys.user],
					(oldUserData: User | undefined) => {
						if (!oldUserData) return undefined;
						const newUserData = { ...oldUserData };
						if (data?.extra) {
							newUserData.extraItems = data.extra.map(
								(item: ShoppingListItem) => ({
									_id: item.item._id,
									quantity: item.quantity,
									unit: item.unit,
									obtained: item.obtained,
								}),
							);
						}
						if (data?.shopping) {
							newUserData.shoppingList = data.shopping.map(
								(item: ShoppingListItem) => ({
									_id: item.item._id,
									quantity: item.quantity,
									unit: item.unit,
									obtained: item.obtained,
								}),
							);
						}
						return newUserData;
					},
				);
				if (data?.extra) {
					queryClient.setQueryData(
						[queryKeys.extraItems],
						(oldExtraItems: ShoppingListItem[] | undefined) => {
							if (!oldExtraItems) return [];
							return data.extra;
						},
					);
				}
				if (data?.shopping) {
					queryClient.setQueryData(
						[queryKeys.shoppingList],
						(oldShoppingItems: ShoppingListItem[] | undefined) => {
							if (!oldShoppingItems) return [];
							return data.shopping;
						},
					);
				}
			},
			onError: (error) => {
				console.error('Error toggling item obtained status:', error);
			},
		},
	);

	const combinedItemList = useMemo(
		() => combineArrays(shoppingList, extraItems),
		[shoppingList, extraItems],
	);

	const groupedShoppingList: GroupedShoppingList[] = useMemo(() => {
		return itemCategories.reduce<GroupedShoppingList[]>(
			(acc, category: ItemCategory) => {
				const itemsInCategory: ShoppingListItem[] = combinedItemList.filter(
					(shopItem: ShoppingListItem) =>
						shopItem.item.category === category._id,
				);
				if (itemsInCategory.length > 0) {
					acc.push({
						categoryId: category._id,
						categoryName: category.name,
						faIcon: category.faIcon,
						items: itemsInCategory,
					});
				}
				return acc;
			},
			[],
		);
	}, [itemCategories, combinedItemList]);

	return { groupedShoppingList, toggleObtained };
};

export default useShoppingList;
