import { useQuery } from '@tanstack/react-query';
import useAxios from '../axios/useAxios';
import { queryKeys } from '@/src/providers/Providers';
import { useEffect, useState } from 'react';
import { Recipe } from '@/src/types/types';

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

	const { data: allRecipes = [] } = useQuery([queryKeys.recipes], getRecipes);

	useEffect(() => {
		const newshuffledRecipes: Recipe[] = [...allRecipes].sort(
			() => Math.random() - 0.5,
		);
		setShuffledRecipes(newshuffledRecipes);

		if (allRecipes.length) {
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
	}, [allRecipes, setCookingTimeMinMax]);

	return { allRecipes: shuffledRecipes, cookingTimeMinMax };
};

export default useRecipes;
