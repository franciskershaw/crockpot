import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '@/src/hooks/axios/useAxios';
import { queryKeys } from '@/src/providers/Providers';
import useUser from '@/src/hooks/auth/useUser';
import { useState } from 'react';
import { createConfig } from '@/src/helper';
import { MenuRecipe, RecipeMenuData, User } from '@/src/types/types';

type RecipeMenuVariables = {
	recipeId?: string;
	serves?: number;
	type: 'add' | 'remove' | 'clear';
};

const useRecipeMenu = () => {
	const queryClient = useQueryClient();

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
		const body = type !== 'clear' ? { _id: recipeId, serves } : undefined;
		const response = await api.put(
			`/api/users/recipeMenu/${type}`,
			body,
			config,
		);
		return response.data;
	};

	const { data: recipeMenu = [] } = useQuery(
		[queryKeys.recipeMenu],
		getRecipeMenu,
	);

	// useMutation hooks
	const { mutate: updateRecipeMenu } = useMutation(
		(variables: RecipeMenuVariables) => updateRecipeMenuReq(variables),
		{
			onSuccess: (data) => {
				queryClient.setQueryData(
					[queryKeys.user],
					(oldUserData: User | undefined) => {
						if (!oldUserData) return undefined;
						const newUserData = { ...oldUserData };
						newUserData.recipeMenu = data.map((recipe: MenuRecipe) => ({
							_id: recipe.recipe._id,
							serves: recipe.serves,
						}));
						return newUserData;
					},
				);

				queryClient.setQueryData(
					[queryKeys.recipeMenu],
					(prevRecipeMenu: RecipeMenuData[] | undefined) => {
						if (!prevRecipeMenu) return [];
						return data;
					},
				);
				queryClient.refetchQueries([queryKeys.shoppingList]);
				queryClient.refetchQueries([queryKeys.extraItems]);
			},
			onError: (error) => {
				console.error('Error toggling item obtained status:', error);
			},
		},
	);

	return { recipeMenu, updateRecipeMenu };
};

export default useRecipeMenu;
