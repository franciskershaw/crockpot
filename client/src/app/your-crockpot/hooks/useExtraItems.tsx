import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '@/src/hooks/axios/useAxios';
import { queryKeys } from '@/src/providers/Providers';
import useUser from '@/src/hooks/auth/useUser';
import { createConfig } from '@/src/helper';
import { User, ShoppingListItem } from '@/src/types/types';

type UpdateExtraItemsBody = {
	quantity?: number;
	unit?: string;
	obtained?: boolean;
};

type UpdateExtraItemsVariables = {
	itemId: string;
	body: UpdateExtraItemsBody;
};

const useExtraItems = () => {
	const queryClient = useQueryClient();
	const api = useAxios();
	const { user } = useUser();

	// Requests
	const getExtraItemsReq = async () => {
		const config = createConfig(user);
		const response = await api.get('/api/users/extraItems', config);
		return response.data;
	};

	const updateExtraItemsReq = async ({
		itemId,
		body,
	}: UpdateExtraItemsVariables) => {
		const config = createConfig(user);
		const response = await api.put(
			`/api/users/extraItems/${itemId}`,
			body,
			config,
		);

		return response.data;
	};

	const clearExtraItemsReq = async () => {
		const config = createConfig(user);
		const response = await api.put('/api/users/clearExtraItems', {}, config);
		return response.data;
	};

	// useQuery hooks
	const { data: extraItems = [] } = useQuery(
		[queryKeys.extraItems],
		getExtraItemsReq,
	);

	// useMutation hooks
	const { mutate: updateExtraItems } = useMutation(
		(variables: UpdateExtraItemsVariables) => updateExtraItemsReq(variables),
		{
			onSuccess: (data) => {
				queryClient.setQueryData(
					[queryKeys.user],
					(oldUserData: User | undefined) => {
						if (!oldUserData) return undefined;
						const newUserData = { ...oldUserData };
						newUserData.extraItems = data.map((item: ShoppingListItem) => ({
							_id: item.item._id,
							quantity: item.quantity,
							unit: item.unit,
							obtained: item.obtained,
						}));
						return newUserData;
					},
				);

				queryClient.setQueryData(
					[queryKeys.extraItems],
					(oldExtraItems: ShoppingListItem[] | undefined) => {
						if (!oldExtraItems) return [];
						return data;
					},
				);
			},
			onError: (error) => {
				console.error('Error updating extra items:', error);
			},
		},
	);

	const { mutate: clearExtraItems } = useMutation(clearExtraItemsReq, {
		onSuccess: () => {
			queryClient.setQueryData(
				[queryKeys.user],
				(oldUserData: User | undefined) => {
					if (!oldUserData) return undefined;
					const newUserData = { ...oldUserData };
					newUserData.extraItems = [];
					return newUserData;
				},
			);

			queryClient.setQueryData(
				[queryKeys.extraItems],
				(oldExtraItems: ShoppingListItem[] | undefined) => {
					if (!oldExtraItems) return [];
					return [];
				},
			);
		},
		onError: (error) => {
			console.error('Error updating extra items:', error);
		},
	});

	return { extraItems, updateExtraItems, clearExtraItems };
};

export default useExtraItems;
