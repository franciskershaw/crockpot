import { useEffect, useState } from 'react';

import { queryKeys } from '@/src/providers/Providers';
import { useQuery } from '@tanstack/react-query';

import { Recipe } from '@/src/types/types';

import useAxios from '../axios/useAxios';

const useRecipes = () => {
	const [cookingTimeMinMax, setCookingTimeMinMax] = useState({
		min: 0,
		max: 0,
	});
	const [shuffledRecipes, setShuffledRecipes] = useState<Recipe[]>([]);

	const api = useAxios();

	const getRecipes = async () => {
		const response = await api.get('/api/recipes');
		return response.data;
	};

	const { data: allRecipes = [], isFetching } = useQuery(
		[queryKeys.recipes],
		getRecipes,
	);

	useEffect(() => {
		if (allRecipes.length) {
			const newshuffledRecipes: Recipe[] = [...allRecipes].sort(
				() => Math.random() - 0.5,
			);
			setShuffledRecipes(newshuffledRecipes);
			let minTime = allRecipes[0].timeInMinutes;
			let maxTime = allRecipes[0].timeInMinutes;

			for (const recipe of allRecipes) {
				if (recipe.timeInMinutes < minTime) {
					minTime = recipe.timeInMinutes;
				}
				if (recipe.timeInMinutes > maxTime) {
					maxTime = recipe.timeInMinutes;
				}
			}
			setCookingTimeMinMax({ min: minTime, max: maxTime });
		}
	}, [allRecipes]);

	const filterRecipes = (array: Recipe[], searchQuery: string) => {
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

	return {
		allRecipes,
		shuffledRecipes,
		cookingTimeMinMax,
		filterRecipes,
		isFetching,
	};
};

export default useRecipes;
