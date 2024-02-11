import { queryKeys } from '@/providers/Providers';
import { useQuery } from '@tanstack/react-query';

import useAxios from '../axios/useAxios';

const useRecipeCategories = () => {
	const api = useAxios();

	const getRecipeCategories = async () => {
		const response = await api.get('/api/recipeCategories');
		return response.data;
	};

	const { data: recipeCategories = [] } = useQuery(
		[queryKeys.recipeCategories],
		getRecipeCategories,
	);

	const sortedRecipeCategories = [...recipeCategories].sort((a, b) =>
		a.name.localeCompare(b.name),
	);

	return { recipeCategories: sortedRecipeCategories };
};

export default useRecipeCategories;
