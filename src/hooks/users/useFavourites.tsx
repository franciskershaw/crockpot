import { createConfig } from '@/helper';
import { queryKeys } from '@/providers/Providers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Recipe, User } from '@/types/types';

import useUser from '../auth/useUser';
import useAxios from '../axios/useAxios';

type FavouriteVariables = {
	_id: string;
};

const useFavourites = () => {
	const queryClient = useQueryClient();
	const api = useAxios();
	const { user } = useUser();

	// Requests
	const getFavouriteRecipesReq = async () => {
		if (!user) {
			throw new Error('User is not authenticated');
		}
		const config = createConfig(user);
		const response = await api.get('/api/users/favourites', config);
		return response.data;
	};

	const { data: favouriteRecipes = [] } = useQuery(
		[queryKeys.favouriteRecipes],
		getFavouriteRecipesReq,
		{
			enabled: !!user,
		},
	);

	// useMutation hook
	const toggleFavouriteReq = async ({ _id }: FavouriteVariables) => {
		if (user) {
			const config = createConfig(user);
			const response = await api.put(
				`/api/users/favourites`,
				{
					_id,
				},
				config,
			);
			if (response) return response?.data;
		}
		return null;
	};

	const { mutate: toggleFavourite } = useMutation(
		(variables: FavouriteVariables) => toggleFavouriteReq(variables),
		{
			onSuccess: (data) => {
				queryClient.setQueryData(
					[queryKeys.user],
					(oldUserData: User | undefined) => {
						if (!oldUserData) {
							return undefined;
						}
						const newUserData = { ...oldUserData };
						newUserData.favouriteRecipes = data.map(
							(recipe: Recipe) => recipe._id,
						);
						return newUserData;
					},
				);
				queryClient.setQueryData(
					[queryKeys.favouriteRecipes],
					(oldFavourites: Recipe[] | undefined) => {
						if (!oldFavourites) return [];
						return data;
					},
				);
			},
			onError: (error) => {
				console.error('Error toggling recipe favourite status:', error);
			},
		},
	);

	return {
		favouriteRecipes,
		toggleFavourite,
	};
};

export default useFavourites;
