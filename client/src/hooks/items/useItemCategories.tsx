import { queryKeys } from '@/src/providers/Providers';
import { useQuery } from '@tanstack/react-query';

import { ItemCategory } from '@/src/types/types';

import useAxios from '../axios/useAxios';

const useItemCategories = () => {
	const api = useAxios();

	const getItemCategories = async (): Promise<ItemCategory[]> => {
		const response = await api.get<ItemCategory[]>('/api/itemCategories');
		return response.data;
	};

	const { data: itemCategories = [] } = useQuery<ItemCategory[]>(
		[queryKeys.itemCategories],
		getItemCategories,
	);

	return { itemCategories };
};

export default useItemCategories;
