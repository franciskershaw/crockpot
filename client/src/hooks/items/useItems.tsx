import { useQuery } from '@tanstack/react-query';
import useAxios from '../axios/useAxios';
import { queryKeys } from '@/src/providers/Providers';
import { Item } from '@/src/types/types';

const householdCategoryId = '6310a881b61a0ace3a1281ec';

const useItems = () => {
	const api = useAxios();

	const getItems = async () => {
		const response = await api.get('/api/items');
		return response.data;
	};

	const { data: allItems = [] } = useQuery([queryKeys.items], getItems);

	const ingredients = allItems.filter(
		(item: Item) => item.category !== householdCategoryId,
	);

	const filterItems = (array: Item[], searchQuery: string) => {
		if (searchQuery === '') {
			return [];
		}

		const lowerCaseSearchQuery = searchQuery.toLowerCase();

		const startsWithResults = array.filter((item) =>
			item.name.toLowerCase().startsWith(lowerCaseSearchQuery),
		);

		if (startsWithResults.length >= 5) {
			return startsWithResults.slice(0, 5);
		}

		const includesResults = array.filter((item) =>
			item.name.toLowerCase().includes(lowerCaseSearchQuery),
		);

		const combinedResults = Array.from(
			new Set([...startsWithResults, ...includesResults]),
		);

		return combinedResults.slice(0, 5);
	};

	return { allItems, ingredients, filterItems };
};

export default useItems;
