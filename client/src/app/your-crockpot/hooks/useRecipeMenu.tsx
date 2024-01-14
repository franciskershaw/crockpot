import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '@/src/hooks/axios/useAxios';
import { queryKeys } from '@/src/providers/Providers';
import useUser from '@/src/hooks/auth/useUser';
import { useState } from 'react';
import { createConfig } from '@/src/helper';

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
			onSuccess: (data, changed) => {
				// manually update user to have new recipeMenu as array
				queryClient.invalidateQueries([queryKeys.user]);
				queryClient.invalidateQueries([queryKeys.recipeMenu]);
				// keep these two last ones as is I think?
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
