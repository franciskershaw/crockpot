import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from '../axios/useAxios';
import useUser from '../auth/useUser';
import { createConfig } from '@/src/helper';
import { queryKeys } from '@/src/providers/Providers';

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
		if (!user) {
			throw new Error('User is not authenticated');
		}
		const config = createConfig(user);
		await api.put(
			`/api/users/favourites`,
			{
				_id,
			},
			config,
		);
	};

	const { mutate: toggleFavourite } = useMutation(
		(variables: FavouriteVariables) => toggleFavouriteReq(variables),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([queryKeys.user]);
				queryClient.invalidateQueries([queryKeys.favouriteRecipes]);
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
