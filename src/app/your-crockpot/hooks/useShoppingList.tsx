import { useMemo } from 'react';

import { combineArrays, createConfig } from '@/helper';
import { queryKeys } from '@/providers/Providers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
	GroupedShoppingList,
	IShoppingListItem,
	ItemCategory,
	User,
} from '@/types/types';

import useUser from '@/hooks/auth/useUser';
import useAxios from '@/hooks/axios/useAxios';
import useItemCategories from '@/hooks/items/useItemCategories';

import useExtraItems from './useExtraItems';

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
				(item: IShoppingListItem) => item.item._id === itemId,
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
	const { data: shoppingList = [] } = useQuery({
		queryKey: [queryKeys.shoppingList],
		queryFn: getShoppingListReq,
		enabled: !!user,
	});

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
								(item: IShoppingListItem) => ({
									_id: item.item._id,
									quantity: item.quantity,
									unit: item.unit,
									obtained: item.obtained,
								}),
							);
						}
						if (data?.shopping) {
							newUserData.shoppingList = data.shopping.map(
								(item: IShoppingListItem) => ({
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
						(oldExtraItems: IShoppingListItem[] | undefined) => {
							if (!oldExtraItems) return [];
							return data.extra;
						},
					);
				}
				if (data?.shopping) {
					queryClient.setQueryData(
						[queryKeys.shoppingList],
						(oldShoppingItems: IShoppingListItem[] | undefined) => {
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
				const itemsInCategory: IShoppingListItem[] = combinedItemList.filter(
					(shopItem: IShoppingListItem) =>
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
