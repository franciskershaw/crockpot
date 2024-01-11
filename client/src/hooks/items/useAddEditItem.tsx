import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/providers/Providers';
import useUser from '../auth/useUser';
import useAxios from '../axios/useAxios';

const useAddItem = () => {
	const { user } = useUser();
	const queryClient = useQueryClient();
	const api = useAxios();

	const addItem = async (itemData: { name: string; category: string }) => {
		const config = {
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
			},
		};

		const response = await api.post(`/api/items`, itemData, config);

		return response.data;
	};

	const { mutate } = useMutation(
		(itemData: { name: string; category: string }) => addItem(itemData),
		{
			onSuccess: async (data) => {
				await queryClient.invalidateQueries([queryKeys.items], {});
			},
			onError: (data) => {
				console.log(data);
			},
		},
	);

	return mutate;
};

export default useAddItem;
