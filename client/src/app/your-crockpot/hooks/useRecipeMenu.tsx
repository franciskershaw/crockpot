import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '@/src/hooks/axios/useAxios';
import { queryKeys } from '@/src/providers/Providers';
import useUser from '@/src/hooks/auth/useUser';
import { useState, useEffect } from 'react';
import { MenuRecipe } from '@/src/types/types';
import { createConfig } from '@/src/helper';

type RecipeMenuVariables = {
	recipeId: string;
	serves: number;
	type: 'add' | 'remove';
};

const useRecipeMenu = () => {
	const queryClient = useQueryClient();

	const [recipeMenuRecipes, setRecipeMenuRecipes] = useState([]);

	const api = useAxios();
	const { user } = useUser();

	// Queries
	const getRecipeMenu = async () => {
		const config = createConfig(user);
		const response = await api.get('/api/users/recipeMenu', config);
		return response.data;
	};

	const updateRecipeMenuReq = async ({
		recipeId,
		serves,
		type,
	}: RecipeMenuVariables) => {
		const config = createConfig(user);
		const body = {
			_id: recipeId,
			serves,
		};
		await api.put(`/api/users/recipeMenu/${type}`, body, config);
	};

	const { data: recipeMenu = [] } = useQuery(
		[queryKeys.recipeMenu],
		getRecipeMenu,
	);

	// useMutation hooks
	const { mutate: updateRecipeMenu } = useMutation(
		(variables: RecipeMenuVariables) => updateRecipeMenuReq(variables),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([queryKeys.user]);
				queryClient.invalidateQueries([queryKeys.recipeMenu]);
				queryClient.refetchQueries([queryKeys.shoppingList]);
				queryClient.refetchQueries([queryKeys.extraItems]);
			},
			onError: (error) => {
				console.error('Error toggling item obtained status:', error);
			},
		},
	);

	useEffect(() => {
		if (recipeMenu.length) {
			setRecipeMenuRecipes(
				recipeMenu.map((recipe: MenuRecipe) => recipe.recipe),
			);
		} else {
			setRecipeMenuRecipes([]);
		}
	}, [recipeMenu]);

	return { recipeMenu, recipeMenuRecipes, updateRecipeMenu };
};

export default useRecipeMenu;
