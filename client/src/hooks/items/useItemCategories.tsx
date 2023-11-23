import { useQuery } from '@tanstack/react-query';
import useAxios from '../axios/useAxios';
import { queryKeys } from '@/src/providers/Providers';
import { ItemCategory } from '@/src/types/types'; // Import your ItemCategory type

const useItemCategories = () => {
	const api = useAxios();

	// Type the returned data as an array of ItemCategory
	const getItemCategories = async (): Promise<ItemCategory[]> => {
		const response = await api.get<ItemCategory[]>('/api/itemCategories'); // Specify the type of data we are getting
		return response.data;
	};

	// Type the data variable
	const { data: itemCategories = [] } = useQuery<ItemCategory[]>(
		[queryKeys.itemCategories],
		getItemCategories,
	);

	return { itemCategories };
};

export default useItemCategories;
