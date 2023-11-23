import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '@/src/hooks/axios/useAxios';
import { queryKeys } from '@/src/providers/Providers';
import useUser from '@/src/hooks/auth/useUser';
import { createConfig } from '@/src/helper';

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
			onSuccess: () => {
				queryClient.invalidateQueries([queryKeys.user]);
				queryClient.invalidateQueries([queryKeys.extraItems]);
			},
			onError: (error) => {
				console.error('Error updating extra items:', error);
			},
		},
	);

	const { mutate: clearExtraItems } = useMutation(clearExtraItemsReq, {
		onSuccess: () => {
			queryClient.invalidateQueries([queryKeys.user]);
			queryClient.invalidateQueries([queryKeys.extraItems]);
		},
		onError: (error) => {
			console.error('Error updating extra items:', error);
		},
	});

	return { extraItems, updateExtraItems, clearExtraItems };
};

export default useExtraItems;
